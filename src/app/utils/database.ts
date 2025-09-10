import { db } from '@/app/utils/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { LinkData, ClickEvent, PublicLinkData } from "../types/types";
import { updateAnalyticsSummary, getUniqueIPs } from './analyticsAggregator';

export interface LinkInfo {
  originalUrl: string;
  isPublic: boolean;
  hasPassword: boolean;
  isExpired: boolean;
  password?: string;
  expiresAt?: any;
}

export async function getOriginalUrl(shortCode: string): Promise<string | null> {
  try {
    // Primeiro, verificar se é um link público
    const publicDoc = await db.collection('publicLinks').doc(shortCode).get();
    if (publicDoc.exists) {
      const publicData = publicDoc.data() as PublicLinkData;
      return publicData.originalUrl;
    }

    // Se não for público, buscar nos links de usuários
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const linkDoc = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('links')
        .doc(shortCode)
        .get();

      if (linkDoc.exists) {
        const linkData = linkDoc.data() as LinkData;
        return linkData.originalUrl;
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar URL original:', error);
    return null;
  }
}

export async function getLinkInfo(shortCode: string): Promise<LinkInfo | null> {
  try {
    // Primeiro, verificar se é um link público
    const publicDoc = await db.collection('publicLinks').doc(shortCode).get();
    if (publicDoc.exists) {
      const publicData = publicDoc.data() as PublicLinkData;
      return {
        originalUrl: publicData.originalUrl,
        isPublic: true,
        hasPassword: false,
        isExpired: false
      };
    }

    // Se não for público, buscar nos links de usuários
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const linkDoc = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('links')
        .doc(shortCode)
        .get();
      
      if (linkDoc.exists) {
        const linkData = linkDoc.data() as LinkData;
        
        // Verificar se o link expirou
        let isExpired = false;
        if (linkData.expiresAt && typeof linkData.expiresAt === 'object' && 'toDate' in linkData.expiresAt) {
          const expirationDate = (linkData.expiresAt as Timestamp).toDate();
          isExpired = new Date() > expirationDate;
        }
        
        return {
          originalUrl: linkData.originalUrl,
          isPublic: false,
          hasPassword: !!linkData.password,
          isExpired,
          password: linkData.password || undefined,
          expiresAt: linkData.expiresAt
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar informações do link:', error);
    return null;
  }
}

export async function saveLinkData(linkData: LinkData): Promise<boolean> {
  try {
    const userRef = db.collection('users').doc(linkData.userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      await userRef.set({
        createdAt: FieldValue.serverTimestamp(),
        linksCount: 0
      });
    }

    await userRef
      .collection('links')
      .doc(linkData.shortCode)
      .set({
        ...linkData,
        createdAt: FieldValue.serverTimestamp(),
        clicks: 0
      });

    await userRef.update({
      linksCount: FieldValue.increment(1)
    });

    return true;
  } catch (error) {
    console.error('Erro ao salvar link:', error);
    return false;
  }
}

export interface PaginatedLinks {
  links: LinkData[];
  totalCount: number;
  hasMore: boolean;
}

export async function getUserLinks(
  userId: string, 
  page: number = 1, 
  limit: number = 20
): Promise<PaginatedLinks> {
  try {
    const offset = (page - 1) * limit;
    
    // Busca total de links para paginação
    const totalSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('links')
      .get();
    
    const totalCount = totalSnapshot.size;
    
    // Busca links paginados
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('links')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get();

    const links = snapshot.docs.map(doc => doc.data() as LinkData);
    const hasMore = offset + limit < totalCount;

    return {
      links,
      totalCount,
      hasMore
    };
  } catch (error) {
    console.error('Erro ao buscar links do usuário:', error);
    return {
      links: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

export async function getUserStats(userId: string) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return {
        totalLinks: 0,
        totalClicks: 0,
        todayClicks: 0
      };
    }

    const linksSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('links')
      .get();

    let totalClicks = 0;
    let todayClicks = 0;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    linksSnapshot.docs.forEach(doc => {
      const linkData = doc.data() as LinkData;
      totalClicks += linkData.clicks || 0;
      
      // Verificar se o link foi criado hoje
      if (linkData.createdAt) {
        let linkDate: Date | null = null;
        
        if (linkData.createdAt instanceof Timestamp) {
          linkDate = linkData.createdAt.toDate();
        } else if (typeof linkData.createdAt === 'object' && '_seconds' in linkData.createdAt) {
          // Caso seja um timestamp serializado
          linkDate = new Date((linkData.createdAt as { _seconds: number })._seconds * 1000);
        }
        
        if (linkDate) {
          const linkDateStart = new Date(linkDate.getFullYear(), linkDate.getMonth(), linkDate.getDate());
          
          if (linkDateStart.getTime() === todayStart.getTime()) {
            todayClicks += linkData.clicks || 0;
          }
        }
      }
    });

    return {
      totalLinks: linksSnapshot.size,
      totalClicks,
      todayClicks
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    return {
      totalLinks: 0,
      totalClicks: 0,
      todayClicks: 0
    };
  }
}

export async function incrementClickCount(shortCode: string): Promise<boolean> {
  try {
    // Primeiro, verificar se é um link público
    const publicDoc = await db.collection('publicLinks').doc(shortCode).get();
    if (publicDoc.exists) {
      await incrementPublicLinkClicks(shortCode);
      return true;
    }

    // Se não for público, buscar nos links de usuários
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const linkRef = db
        .collection('users')
        .doc(userDoc.id)
        .collection('links')
        .doc(shortCode);

      const linkDoc = await linkRef.get();
      if (linkDoc.exists) {
        await linkRef.update({
          clicks: FieldValue.increment(1),
          lastClickAt: FieldValue.serverTimestamp()
        });
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Erro ao incrementar contador de clicks:', error);
    return false;
  }
}

export async function saveClickEvent(clickEvent: ClickEvent): Promise<boolean> {
  try {
    // Encontrar o usuário que possui este shortCode
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const linkDoc = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('links')
        .doc(clickEvent.shortCode)
        .get();

      if (linkDoc.exists) {
        // Salvar o evento de click na subcollection analytics
        await db
          .collection('users')
          .doc(userDoc.id)
          .collection('analytics')
          .doc(clickEvent.shortCode)
          .collection('clicks')
          .doc(clickEvent.id)
          .set({
            ...clickEvent,
            timestamp: FieldValue.serverTimestamp()
          });

        try {
          // Calcular IPs únicos atualizados
          console.log(`Iniciando agregação de analytics para ${clickEvent.shortCode}...`);
          const uniqueIPs = await getUniqueIPs(userDoc.id, clickEvent.shortCode);
          uniqueIPs.add(clickEvent.ip); // Adicionar o novo IP
          console.log(`IPs únicos calculados: ${uniqueIPs.size}`);
          
          // Atualizar analytics agregados incrementalmente
          const analyticsUpdated = await updateAnalyticsSummary(
            userDoc.id, 
            clickEvent.shortCode, 
            clickEvent,
            uniqueIPs
          );

          if (analyticsUpdated) {
            console.log(`ClickEvent e analytics atualizados: ${clickEvent.id} para ${clickEvent.shortCode}`);
          } else {
            console.warn(`ClickEvent salvo mas falha ao atualizar analytics: ${clickEvent.id}`);
          }
        } catch (analyticsError) {
          console.error(`Erro ao processar analytics para ${clickEvent.shortCode}:`, analyticsError);
        }
        
        return true;
      }
    }

    console.error(`Link não encontrado para shortCode: ${clickEvent.shortCode}`);
    return false;
  } catch (error) {
    console.error('Erro ao salvar ClickEvent:', error);
    return false;
  }
}

export async function getClickEvents(
  shortCode: string, 
  userId: string, 
  limit: number = 100
): Promise<ClickEvent[]> {
  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('analytics')
      .doc(shortCode)
      .collection('clicks')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as ClickEvent);
  } catch (error) {
    console.error('Erro ao buscar ClickEvents:', error);
    return [];
  }
}

export async function getAnalyticsSummary(
  shortCode: string, 
  userId: string
): Promise<Record<string, unknown> | null> {
  try {
    const clickEvents = await getClickEvents(shortCode, userId, 1000);
    
    if (clickEvents.length === 0) {
      return {
        totalClicks: 0,
        uniqueClicks: 0,
        countries: {},
        regions: {},
        cities: {},
        devices: {},
        browsers: {},
        operatingSystems: {},
        referrers: {},
        utmSources: {},
        utmMediums: {},
        utmCampaigns: {},
        clicksByHour: {},
        clicksByDay: {},
        clicksByDate: {},
        clicksByMonth: {}
      };
    }

    // Agregações
    const countries: Record<string, number> = {};
    const regions: Record<string, number> = {};
    const cities: Record<string, number> = {};
    const devices: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const operatingSystems: Record<string, number> = {};
    const referrers: Record<string, number> = {};
    const utmSources: Record<string, number> = {};
    const utmMediums: Record<string, number> = {};
    const utmCampaigns: Record<string, number> = {};

    // Processar cada click event
    clickEvents.forEach(event => {
      // Geographic data
      if (event.country) {
        countries[event.country] = (countries[event.country] || 0) + 1;
      }
      if (event.region) {
        regions[event.region] = (regions[event.region] || 0) + 1;
      }
      if (event.city) {
        cities[event.city] = (cities[event.city] || 0) + 1;
      }

      // Device data
      if (event.device?.type) {
        devices[event.device.type] = (devices[event.device.type] || 0) + 1;
      }
      if (event.browser?.name) {
        browsers[event.browser.name] = (browsers[event.browser.name] || 0) + 1;
      }
      if (event.os?.name) {
        operatingSystems[event.os.name] = (operatingSystems[event.os.name] || 0) + 1;
      }

      // Referrer data
      const referrer = processReferer(event.referer);
      referrers[referrer] = (referrers[referrer] || 0) + 1;

      // UTM data
      if (event.utmSource) {
        utmSources[event.utmSource] = (utmSources[event.utmSource] || 0) + 1;
      }
      if (event.utmMedium) {
        utmMediums[event.utmMedium] = (utmMediums[event.utmMedium] || 0) + 1;
      }
      if (event.utmCampaign) {
        utmCampaigns[event.utmCampaign] = (utmCampaigns[event.utmCampaign] || 0) + 1;
      }
    });

    // Calcular cliques únicos (baseado em IP único)
    const uniqueIPs = new Set(clickEvents.map(event => event.ip));

    return {
      totalClicks: clickEvents.length,
      uniqueClicks: uniqueIPs.size,
      countries,
      regions,
      cities,
      devices,
      browsers,
      operatingSystems,
      referrers,
      utmSources,
      utmMediums,
      utmCampaigns,
      clicksByHour: {},
      clicksByDay: {},
      clicksByDate: {},
      clicksByMonth: {}
    };
  } catch (error) {
    console.error('Erro ao gerar analytics summary:', error);
    return null;
  }
}

// Helper function para processar referrer
function processReferer(referer: string | null): string {
  if (!referer) return 'Direct';
  
  try {
    const url = new URL(referer);
    const hostname = url.hostname.toLowerCase();
    
    // Social media platforms
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'Facebook';
    if (hostname.includes('twitter.com') || hostname.includes('t.co')) return 'Twitter';
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    
    // Search engines
    if (hostname.includes('google.com')) return 'Google Search';
    if (hostname.includes('bing.com')) return 'Bing Search';
    
    // Messaging apps
    if (hostname.includes('whatsapp.com') || hostname.includes('wa.me')) return 'WhatsApp';
    if (hostname.includes('telegram.org') || hostname.includes('t.me')) return 'Telegram';
    
    return hostname;
  } catch {
    return 'Unknown';
  }
}

// ============ PUBLIC LINKS FUNCTIONS ============

/**
 * Salva um link público na coleção global 'publicLinks'
 */
export async function savePublicLinkData(linkData: PublicLinkData): Promise<boolean> {
  try {
    await db
      .collection('publicLinks')
      .doc(linkData.shortCode)
      .set({
        ...linkData,
        createdAt: FieldValue.serverTimestamp(),
        clicks: 0
      });

    console.log(`Link público salvo: ${linkData.shortCode}`);
    return true;
  } catch (error) {
    console.error('Erro ao salvar link público:', error);
    return false;
  }
}

/**
 * Busca um link público pelo shortCode
 */
export async function getPublicLinkData(shortCode: string): Promise<PublicLinkData | null> {
  try {
    const linkDoc = await db
      .collection('publicLinks')
      .doc(shortCode)
      .get();

    if (linkDoc.exists) {
      return linkDoc.data() as PublicLinkData;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar link público:', error);
    return null;
  }
}

/**
 * Incrementa contador de clicks de um link público
 */
export async function incrementPublicLinkClicks(shortCode: string): Promise<boolean> {
  try {
    const linkRef = db.collection('publicLinks').doc(shortCode);
    
    await linkRef.update({
      clicks: FieldValue.increment(1),
      lastClickAt: FieldValue.serverTimestamp()
    });

    console.log(`Click incrementado para link público: ${shortCode}`);
    return true;
  } catch (error) {
    console.error('Erro ao incrementar clicks do link público:', error);
    return false;
  }
}

/**
 * Verifica se um shortCode já existe (tanto em links privados quanto públicos)
 */
export async function shortCodeExists(shortCode: string): Promise<boolean> {
  try {
    // Verificar na coleção pública
    const publicDoc = await db.collection('publicLinks').doc(shortCode).get();
    if (publicDoc.exists) return true;

    // Verificar nas coleções de usuários
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const linkDoc = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('links')
        .doc(shortCode)
        .get();

      if (linkDoc.exists) return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao verificar existência do shortCode:', error);
    return true; // Em caso de erro, assume que existe para evitar conflitos
  }
}

/**
 * Busca links públicos sem atividade recente para possível limpeza
 */
export async function getInactivePublicLinks(daysInactive: number = 365): Promise<PublicLinkData[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const snapshot = await db
      .collection('publicLinks')
      .where('lastClickAt', '<', cutoffDate)
      .get();

    const inactiveLinks: PublicLinkData[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as PublicLinkData;
      inactiveLinks.push(data);
    });

    // Também incluir links que nunca tiveram clicks e são muito antigos
    const oldLinksSnapshot = await db
      .collection('publicLinks')
      .where('createdAt', '<', cutoffDate)
      .where('clicks', '==', 0)
      .get();

    oldLinksSnapshot.docs.forEach(doc => {
      const data = doc.data() as PublicLinkData;
      // Evitar duplicatas
      if (!inactiveLinks.some(link => link.shortCode === data.shortCode)) {
        inactiveLinks.push(data);
      }
    });

    console.log(`Encontrados ${inactiveLinks.length} links públicos inativos há mais de ${daysInactive} dias`);
    return inactiveLinks;
  } catch (error) {
    console.error('Erro ao buscar links públicos inativos:', error);
    return [];
  }
}

/**
 * Remove um link público específico
 */
export async function deletePublicLink(shortCode: string): Promise<boolean> {
  try {
    await db.collection('publicLinks').doc(shortCode).delete();
    console.log(`Link público deletado: ${shortCode}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar link público:', error);
    return false;
  }
}

/**
 * Remove múltiplos links públicos em lote
 */
export async function deletePublicLinksInBatch(shortCodes: string[]): Promise<{
  successful: string[];
  failed: string[];
}> {
  const successful: string[] = [];
  const failed: string[] = [];

  for (const shortCode of shortCodes) {
    const deleted = await deletePublicLink(shortCode);
    if (deleted) {
      successful.push(shortCode);
    } else {
      failed.push(shortCode);
    }
  }

  console.log(`Limpeza de links públicos: ${successful.length} deletados, ${failed.length} falharam`);
  return { successful, failed };
}
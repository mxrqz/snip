import { db } from '@/app/utils/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { 
  ClickEvent, 
  ProfessionalAnalytics, 
  AnalyticsTotals, 
  AnalyticsCharts, 
  AnalyticsBreakdowns
} from '@/app/types/types';

/**
 * Inicializa documento de analytics agregados para um novo shortCode
 */
export async function initializeAnalyticsSummary(
  userId: string, 
  shortCode: string, 
  createdAt: Timestamp
): Promise<boolean> {
  try {
    const emptyAnalytics: ProfessionalAnalytics = {
      shortCode,
      totals: {
        clicks: 0,
        uniqueClicks: 0,
        countries: 0,
        devices: 0,
        browsers: 0,
        lastUpdated: FieldValue.serverTimestamp()
      },
      charts: {
        peakHours: [],
        topLocations: [],
        deviceBreakdown: []
      },
      breakdowns: {
        countries: {},
        regions: {},
        cities: {},
        devices: {},
        browsers: {},
        operatingSystems: {},
        referrers: {},
        utmSources: {},
        utmMediums: {},
        utmCampaigns: {}
      },
      createdAt
    };

    await db
      .collection('users')
      .doc(userId)
      .collection('analytics')
      .doc(shortCode)
      .collection('summary')
      .doc('data')
      .set(emptyAnalytics);

    console.log(`Analytics summary inicializado para ${shortCode}`);
    return true;
  } catch (error) {
    console.error('Erro ao inicializar analytics summary:', error);
    return false;
  }
}

/**
 * Atualiza arrays para gráficos de forma incremental
 */
function updateChartsArrays(
  currentCharts: AnalyticsCharts,
  clickEvent: ClickEvent
): AnalyticsCharts {
  // Atualizar peak hours
  const timestamp = clickEvent.timestamp as Timestamp;
  const hour = timestamp.toDate().getHours();
  const hourString = `${hour.toString().padStart(2, '0')}:00`;
  const hourLabel = `${hour}h`;

  let peakHours = [...currentCharts.peakHours];
  const hourIndex = peakHours.findIndex(h => h.hour === hourString);
  
  if (hourIndex >= 0) {
    peakHours[hourIndex].clicks++;
  } else {
    peakHours.push({
      hour: hourString,
      clicks: 1,
      label: hourLabel
    });
  }
  
  // Manter apenas top 24 horas, ordenadas por clicks
  peakHours = peakHours
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 24);

  // Atualizar top locations
  let topLocations = [...currentCharts.topLocations];
  
  if (clickEvent.city && clickEvent.region && clickEvent.country) {
    const location = `${clickEvent.city}, ${clickEvent.region}`;
    const locationIndex = topLocations.findIndex(l => l.location === location);
    
    if (locationIndex >= 0) {
      topLocations[locationIndex].clicks++;
    } else {
      topLocations.push({
        location,
        country: clickEvent.country,
        countryCode: clickEvent.countryCode || 'BR',
        clicks: 1,
        percentage: 0 // Será calculado depois
      });
    }
    
    // Recalcular percentuais e manter top 10
    const totalLocationClicks = topLocations.reduce((sum, loc) => sum + loc.clicks, 0);
    topLocations = topLocations
      .map(loc => ({
        ...loc,
        percentage: Math.round((loc.clicks / totalLocationClicks) * 100)
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  }

  // Atualizar device breakdown
  let deviceBreakdown = [...currentCharts.deviceBreakdown];
  const deviceType = clickEvent.device.type;
  const deviceIndex = deviceBreakdown.findIndex(d => d.device === deviceType);
  
  if (deviceIndex >= 0) {
    deviceBreakdown[deviceIndex].clicks++;
  } else {
    deviceBreakdown.push({
      device: deviceType,
      clicks: 1,
      percentage: 0 // Será calculado depois
    });
  }
  
  // Recalcular percentuais
  const totalDeviceClicks = deviceBreakdown.reduce((sum, dev) => sum + dev.clicks, 0);
  deviceBreakdown = deviceBreakdown.map(dev => ({
    ...dev,
    percentage: Math.round((dev.clicks / totalDeviceClicks) * 100)
  }));

  return {
    peakHours,
    topLocations,
    deviceBreakdown
  };
}

/**
 * Atualiza breakdowns detalhados
 */
function updateBreakdowns(
  currentBreakdowns: AnalyticsBreakdowns,
  clickEvent: ClickEvent
): AnalyticsBreakdowns {
  const updated = { ...currentBreakdowns };

  // Geographic
  if (clickEvent.country) {
    updated.countries[clickEvent.country] = (updated.countries[clickEvent.country] || 0) + 1;
  }
  if (clickEvent.region) {
    updated.regions[clickEvent.region] = (updated.regions[clickEvent.region] || 0) + 1;
  }
  if (clickEvent.city) {
    updated.cities[clickEvent.city] = (updated.cities[clickEvent.city] || 0) + 1;
  }

  // Device & Tech
  updated.devices[clickEvent.device.type] = (updated.devices[clickEvent.device.type] || 0) + 1;
  updated.browsers[clickEvent.browser.name] = (updated.browsers[clickEvent.browser.name] || 0) + 1;
  updated.operatingSystems[clickEvent.os.name] = (updated.operatingSystems[clickEvent.os.name] || 0) + 1;

  // Traffic sources
  const referrer = processReferer(clickEvent.referer);
  updated.referrers[referrer] = (updated.referrers[referrer] || 0) + 1;

  if (clickEvent.utmSource) {
    updated.utmSources[clickEvent.utmSource] = (updated.utmSources[clickEvent.utmSource] || 0) + 1;
  }
  if (clickEvent.utmMedium) {
    updated.utmMediums[clickEvent.utmMedium] = (updated.utmMediums[clickEvent.utmMedium] || 0) + 1;
  }
  if (clickEvent.utmCampaign) {
    updated.utmCampaigns[clickEvent.utmCampaign] = (updated.utmCampaigns[clickEvent.utmCampaign] || 0) + 1;
  }

  return updated;
}

/**
 * Atualiza analytics agregados incrementalmente quando um novo click acontece
 */
export async function updateAnalyticsSummary(
  userId: string,
  shortCode: string, 
  clickEvent: ClickEvent,
  uniqueIPs: Set<string>
): Promise<boolean> {
  try {
    const summaryRef = db
      .collection('users')
      .doc(userId)
      .collection('analytics')
      .doc(shortCode)
      .collection('summary')
      .doc('data');

    // Buscar dados atuais
    const currentDoc = await summaryRef.get();
    
    if (!currentDoc.exists) {
      // Primeiro click - inicializar
      const linkDoc = await db
        .collection('users')
        .doc(userId)
        .collection('links')
        .doc(shortCode)
        .get();
      
      const createdAt = linkDoc.exists ? linkDoc.data()?.createdAt : FieldValue.serverTimestamp();
      await initializeAnalyticsSummary(userId, shortCode, createdAt);
      
      // Buscar novamente após inicialização
      const newDoc = await summaryRef.get();
      if (!newDoc.exists) throw new Error('Falha ao inicializar summary');
    }

    // Buscar dados atuais novamente
    const docData = (await summaryRef.get()).data() as ProfessionalAnalytics;
    
    // Contar único devices e browsers únicos
    const currentCountries = Object.keys(docData.breakdowns.countries);
    const currentDevices = Object.keys(docData.breakdowns.devices);  
    const currentBrowsers = Object.keys(docData.breakdowns.browsers);
    
    // Verificar se são novos
    const isNewCountry = clickEvent.country && !currentCountries.includes(clickEvent.country);
    const isNewDevice = !currentDevices.includes(clickEvent.device.type);
    const isNewBrowser = !currentBrowsers.includes(clickEvent.browser.name);

    // Atualizar totals
    const updatedTotals: AnalyticsTotals = {
      clicks: docData.totals.clicks + 1,
      uniqueClicks: uniqueIPs.size,
      countries: docData.totals.countries + (isNewCountry ? 1 : 0),
      devices: docData.totals.devices + (isNewDevice ? 1 : 0),
      browsers: docData.totals.browsers + (isNewBrowser ? 1 : 0),
      lastUpdated: FieldValue.serverTimestamp()
    };

    // Atualizar charts
    const updatedCharts = updateChartsArrays(docData.charts, clickEvent);
    
    // Atualizar breakdowns
    const updatedBreakdowns = updateBreakdowns(docData.breakdowns, clickEvent);

    // Salvar dados atualizados
    const updatedAnalytics: ProfessionalAnalytics = {
      ...docData,
      totals: updatedTotals,
      charts: updatedCharts,
      breakdowns: updatedBreakdowns,
      lastClickAt: FieldValue.serverTimestamp() as Timestamp
    };

    await summaryRef.set(updatedAnalytics);
    
    console.log(`Analytics summary atualizado para ${shortCode}:`, {
      totalClicks: updatedTotals.clicks,
      uniqueClicks: updatedTotals.uniqueClicks,
      countries: updatedTotals.countries,
      devices: updatedTotals.devices
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar analytics summary:', error);
    return false;
  }
}

/**
 * Busca analytics agregados (performance O(1))
 */
export async function getProfessionalAnalytics(
  userId: string, 
  shortCode: string
): Promise<ProfessionalAnalytics | null> {
  try {
    const summaryDoc = await db
      .collection('users')
      .doc(userId)
      .collection('analytics')
      .doc(shortCode)
      .collection('summary')
      .doc('data')
      .get();

    if (!summaryDoc.exists) {
      return null;
    }

    return summaryDoc.data() as ProfessionalAnalytics;
  } catch (error) {
    console.error('Erro ao buscar professional analytics:', error);
    return null;
  }
}

/**
 * Calcula IPs únicos para um shortCode
 */
export async function getUniqueIPs(userId: string, shortCode: string): Promise<Set<string>> {
  try {
    const clicksSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('analytics')
      .doc(shortCode)
      .collection('clicks')
      .get();

    const uniqueIPs = new Set<string>();
    clicksSnapshot.docs.forEach(doc => {
      const clickData = doc.data();
      if (clickData.ip) {
        uniqueIPs.add(clickData.ip);
      }
    });

    return uniqueIPs;
  } catch (error) {
    console.error('Erro ao calcular IPs únicos:', error);
    return new Set();
  }
}

// Helper function para processar referrer (copiada do database.ts)
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
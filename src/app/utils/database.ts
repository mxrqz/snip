import { db } from '@/app/utils/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Timestamp } from "firebase/firestore";

export interface LinkData {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  analyticsUrl: string;
  userId: string;
  createdAt: Timestamp;
  expiresAt: string | null;
  clicks: number;
}

export async function getOriginalUrl(shortCode: string): Promise<string | null> {
  try {
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
    const today = new Date().toDateString();

    linksSnapshot.docs.forEach(doc => {
      const linkData = doc.data() as LinkData;
      totalClicks += linkData.clicks || 0;
      
      // TODO: Implementar contador de cliques diários
      // Para MVP, assumir que todos os cliques são de hoje
      if (linkData.createdAt && new Date(linkData.createdAt).toDateString() === today) {
        todayClicks += linkData.clicks || 0;
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
          clicks: FieldValue.increment(1)
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
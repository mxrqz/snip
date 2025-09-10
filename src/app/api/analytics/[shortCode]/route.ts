import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/app/utils/auth';
import { getAnalyticsSummary } from '@/app/utils/database';
import { getProfessionalAnalytics } from '@/app/utils/analyticsAggregator';
import { db } from '@/app/utils/firebase/admin';
import { LinkAnalytics, ProfessionalAnalytics } from '@/app/types/types';

interface Props {
  params: Promise<{
    shortCode: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const authResult = await validateAuth();
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { shortCode } = await params;

    if (!shortCode || typeof shortCode !== 'string') {
      return NextResponse.json(
        { error: 'Código curto é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao link
    let linkDoc;
    try {
      linkDoc = await db
        .collection('users')
        .doc(authResult.userId!)
        .collection('links')
        .doc(shortCode)
        .get();
    } catch (error: any) {
      // Verificar se é erro de permissão do Firestore
      if (error.code === 'permission-denied') {
        return NextResponse.json(
          { error: 'Acesso negado - Você não tem permissão para visualizar este link' },
          { status: 403 }
        );
      }
      throw error; // Re-throw outros erros
    }

    if (!linkDoc.exists) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    const linkData = linkDoc.data();

    // Tentar buscar analytics profissionais primeiro
    let professionalAnalytics = await getProfessionalAnalytics(authResult.userId!, shortCode);
    
    // Se não existir, criar um fallback usando o método antigo
    if (!professionalAnalytics) {
      console.log(`Nenhum analytics profissional encontrado para ${shortCode}, usando fallback...`);
      const fallbackData = await getAnalyticsSummary(shortCode, authResult.userId!);
      
      if (!fallbackData) {
        return NextResponse.json(
          { error: 'Nenhum dado de analytics encontrado' },
          { status: 404 }
        );
      }

      // Converter para formato legado
      const realAnalytics: LinkAnalytics = {
        shortCode,
        totalClicks: fallbackData.totalClicks,
        uniqueClicks: fallbackData.uniqueClicks,
        lastClickAt: linkData?.lastClickAt?.toDate ? linkData.lastClickAt.toDate().toISOString() : linkData?.lastClickAt || null,
        createdAt: linkData?.createdAt?.toDate ? linkData.createdAt.toDate().toISOString() : linkData?.createdAt || null,
        
        countries: fallbackData.countries,
        regions: fallbackData.regions,
        cities: fallbackData.cities,
        devices: fallbackData.devices,
        browsers: fallbackData.browsers,
        operatingSystems: fallbackData.operatingSystems,
        referrers: fallbackData.referrers,
        utmSources: fallbackData.utmSources,
        utmMediums: fallbackData.utmMediums,
        utmCampaigns: fallbackData.utmCampaigns,
        
        clicksByHour: fallbackData.clicksByHour,
        clicksByDay: fallbackData.clicksByDay,
        clicksByDate: fallbackData.clicksByDate,
        clicksByMonth: fallbackData.clicksByMonth
      };

      return NextResponse.json({
        success: true,
        data: realAnalytics
      });
    }

    // Converter analytics profissionais para formato legado (compatibilidade)
    const realAnalytics: LinkAnalytics = {
      shortCode,
      totalClicks: professionalAnalytics.totals.clicks,
      uniqueClicks: professionalAnalytics.totals.uniqueClicks,
      lastClickAt: professionalAnalytics.lastClickAt?.toDate ? professionalAnalytics.lastClickAt.toDate().toISOString() : professionalAnalytics.lastClickAt || null,
      createdAt: professionalAnalytics.createdAt?.toDate ? professionalAnalytics.createdAt.toDate().toISOString() : professionalAnalytics.createdAt,
      
      countries: professionalAnalytics.breakdowns.countries,
      regions: professionalAnalytics.breakdowns.regions,
      cities: professionalAnalytics.breakdowns.cities,
      devices: professionalAnalytics.breakdowns.devices,
      browsers: professionalAnalytics.breakdowns.browsers,
      operatingSystems: professionalAnalytics.breakdowns.operatingSystems,
      referrers: professionalAnalytics.breakdowns.referrers,
      utmSources: professionalAnalytics.breakdowns.utmSources,
      utmMediums: professionalAnalytics.breakdowns.utmMediums,
      utmCampaigns: professionalAnalytics.breakdowns.utmCampaigns,
      
      // Converter peak hours para formato legacy
      clicksByHour: professionalAnalytics.charts.peakHours.reduce((acc, hour) => {
        const hourNumber = parseInt(hour.hour.split(':')[0]);
        acc[hourNumber.toString()] = hour.clicks;
        return acc;
      }, {} as Record<string, number>),
      clicksByDay: {},
      clicksByDate: {},
      clicksByMonth: {}
    };

    console.log(`Analytics profissionais retornados para ${shortCode}:`, {
      totalClicks: realAnalytics.totalClicks,
      uniqueClicks: realAnalytics.uniqueClicks,
      countries: Object.keys(realAnalytics.countries).length,
      devices: Object.keys(realAnalytics.devices).length
    });

    return NextResponse.json({
      success: true,
      data: realAnalytics
    });

  } catch (error) {
    console.error('Erro no endpoint de analytics:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
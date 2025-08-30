import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/app/utils/auth';
import { generateShortCode, isValidUrl, buildShortUrl, buildAnalyticsUrl } from '@/app/utils/urlShortener';
import { saveLinkData, LinkData } from '@/app/utils/database';
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAuth();
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const originalUrl = searchParams.get('url');

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Parâmetro "url" é obrigatório' },
        { status: 400 }
      );
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'URL fornecida não é válida' },
        { status: 400 }
      );
    }

    const shortCode = generateShortCode();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    const shortUrl = buildShortUrl(shortCode, baseUrl);
    const analyticsUrl = buildAnalyticsUrl(shortCode, baseUrl);

    const linkData: LinkData = {
      shortCode,
      originalUrl,
      shortUrl,
      analyticsUrl,
      userId: authResult.userId!,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: null,
      clicks: 0
    };

    // Salva no Firestore
    const saveSuccess = await saveLinkData(linkData);
    
    if (!saveSuccess) {
      return NextResponse.json(
        { error: 'Erro ao salvar link no banco de dados' },
        { status: 500 }
      );
    }

    const response = {
      success: true,
      data: linkData
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Erro no endpoint /api/encurtar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { savePublicLinkData, shortCodeExists } from '@/app/utils/database';
import { isValidUrl } from '@/app/utils/functions';
import { PublicLinkData, CreatePublicLinkResponse } from '@/app/types/types';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validação da URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL é obrigatória' 
        } as CreatePublicLinkResponse,
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL inválida' 
        } as CreatePublicLinkResponse,
        { status: 400 }
      );
    }

    // Gerar shortCode único
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = nanoid(6);
      attempts++;
      
      if (attempts > maxAttempts) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Não foi possível gerar um código único. Tente novamente.' 
          } as CreatePublicLinkResponse,
          { status: 500 }
        );
      }
    } while (await shortCodeExists(shortCode));

    // Criar dados do link público
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const publicLinkData: PublicLinkData = {
      shortCode,
      originalUrl: url,
      shortUrl: `${baseUrl}/${shortCode}`,
      createdAt: FieldValue.serverTimestamp(),
      clicks: 0
    };

    // Salvar no banco
    const saved = await savePublicLinkData(publicLinkData);
    
    if (!saved) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao salvar o link' 
        } as CreatePublicLinkResponse,
        { status: 500 }
      );
    }

    console.log(`Link público criado: ${shortCode} -> ${url}`);

    return NextResponse.json(
      {
        success: true,
        data: publicLinkData
      } as CreatePublicLinkResponse,
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro no endpoint público de encurtar:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      } as CreatePublicLinkResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Método não permitido. Use POST.' 
    },
    { status: 405 }
  );
}
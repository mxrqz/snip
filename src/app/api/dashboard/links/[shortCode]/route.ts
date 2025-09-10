import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/app/utils/auth';
import { db } from '@/app/utils/firebase/admin';

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

    // Buscar link específico do usuário
    let linkDoc;
    try {
      linkDoc = await db
        .collection('users')
        .doc(authResult.userId!)
        .collection('links')
        .doc(shortCode)
        .get();
    } catch (error: unknown) {
      // Verificar se é erro de permissão do Firestore
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'permission-denied') {
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

    // Converter timestamps para formato compatível com frontend
    const processedData = {
      ...linkData,
      createdAt: linkData?.createdAt?.toDate ? linkData.createdAt.toDate().toISOString() : linkData?.createdAt,
      lastClickAt: linkData?.lastClickAt?.toDate ? linkData.lastClickAt.toDate().toISOString() : linkData?.lastClickAt
    };

    return NextResponse.json({
      success: true,
      data: processedData
    });

  } catch (error) {
    console.error('Erro no endpoint de link individual:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
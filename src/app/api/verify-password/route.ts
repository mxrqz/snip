import { NextRequest, NextResponse } from 'next/server';
import { getLinkInfo } from '@/app/utils/database';
import { PasswordVerificationRequest, PasswordVerificationResponse } from '@/app/types/types';

export async function POST(request: NextRequest) {
  try {
    const body: PasswordVerificationRequest = await request.json();
    const { shortCode, password } = body;

    if (!shortCode || !password) {
      return NextResponse.json({
        success: false,
        error: 'Código e senha são obrigatórios'
      } as PasswordVerificationResponse, { status: 400 });
    }

    const linkInfo = await getLinkInfo(shortCode);

    if (!linkInfo) {
      return NextResponse.json({
        success: false,
        error: 'Link não encontrado'
      } as PasswordVerificationResponse, { status: 404 });
    }

    if (linkInfo.isExpired) {
      return NextResponse.json({
        success: false,
        error: 'Link expirado'
      } as PasswordVerificationResponse, { status:410 });
    }

    if (!linkInfo.hasPassword) {
      return NextResponse.json({
        success: false,
        error: 'Link não protegido por senha'
      } as PasswordVerificationResponse, { status: 400 });
    }

    const isValidPassword = linkInfo.password === password;

    return NextResponse.json({
      success: true,
      valid: isValidPassword
    } as PasswordVerificationResponse);

  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    } as PasswordVerificationResponse, { status: 500 });
  }
}
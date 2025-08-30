import { NextResponse } from 'next/server';
import { validateAuth } from '@/app/utils/auth';
import { getUserStats } from '@/app/utils/database';

export async function GET() {
  try {
    const authResult = await validateAuth();
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const stats = await getUserStats(authResult.userId!);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro no endpoint /api/dashboard/stats:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
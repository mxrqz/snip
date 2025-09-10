import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { incrementClickCount, saveClickEvent, getLinkInfo } from '@/app/utils/database';
import { createClickEvent } from '@/app/utils/analyticsCollector';

interface Props {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function RedirectPage({ params, searchParams }: Props & { searchParams?: Promise<{ password?: string }> }) {
  const { shortCode } = await params;
  const urlSearchParams = searchParams ? await searchParams : {};

  // Obter informações completas do link
  const linkInfo = await getLinkInfo(shortCode);

  if (!linkInfo) {
    notFound();
  }

  // Verificar se o link expirou
  if (linkInfo.isExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Link Expirado</h1>
          <p className="text-muted-foreground">Este link não está mais disponível.</p>
        </div>
      </div>
    );
  }

  // Verificar se precisa de senha
  if (linkInfo.hasPassword) {
    const providedPassword = urlSearchParams.password;
    
    if (!providedPassword || providedPassword !== linkInfo.password) {
      // Redirecionar para página de autenticação
      redirect(`/protected/${shortCode}`);
    }
  }

  if (linkInfo.isPublic) {
    // Para links públicos: apenas incrementar contador, sem analytics
    await incrementClickCount(shortCode);
    console.log(`Redirecionando link público ${shortCode} -> ${linkInfo.originalUrl}`);
    redirect(linkInfo.originalUrl);
  } else {
    // Para links de usuários: coletar analytics completos
    const headersList = await headers();
    const mockRequest = {
      headers: {
        get: (key: string) => headersList.get(key)
      }
    } as NextRequest;

    try {
      // Coletar dados detalhados de analytics
      const clickEvent = await createClickEvent(mockRequest, shortCode);
      
      // Salvar evento de click detalhado
      await saveClickEvent(clickEvent);
      
      // Manter contador básico para compatibilidade
      await incrementClickCount(shortCode);
      
      console.log(`Analytics coletados para ${shortCode}:`, {
        device: clickEvent.device.type,
        browser: clickEvent.browser.name,
        country: clickEvent.country
      });
    } catch (error) {
      console.error('Erro ao coletar analytics:', error);
      // Fallback: apenas incrementar contador básico
      await incrementClickCount(shortCode);
    }

    console.log(`Redirecionando ${shortCode} -> ${linkInfo.originalUrl}`);
    redirect(linkInfo.originalUrl);
  }
}
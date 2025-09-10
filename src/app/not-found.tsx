import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Página não encontrada',
  description: 'A página que você está procurando não foi encontrada. Volte para a página inicial do Snip.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-foreground/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <Link href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}
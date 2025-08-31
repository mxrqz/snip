'use client';

import Link from 'next/link';
import { SnipLogoCompleta } from './snip-logos';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-foreground/60 py-4 font-extralight border-t [border-image:linear-gradient(90deg,#fff0,#fff3_25%,#fff6_75%,#fff0)_1]">
      <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full">
        {/* Main Content */}
        <div className="w-full flex justify-between">

          {/* Left Column - Logo & Description */}
          <div className="space-y-4">
            <SnipLogoCompleta className="h-8 fill-foreground" />

            <p className="max-w-md leading-relaxed text-sm">
              Encurtador de links profissional com analytics completos.
              Transforme URLs longas em links curtos e acompanhe o desempenho
              de suas campanhas em tempo real.
            </p>
          </div>

          {/* Right Column - Legal Links */}
          <div className="flex gap-10 h-fit text-sm">
            <div className="flex flex-col gap-5">
              <Link
                href="/termos"
                className="text-accent-foreground hover:text-foreground/30 h-fit"
              >
                Termos de Uso
              </Link>

              <Link
                href="/privacidade"
                className="text-accent-foreground hover:text-foreground/30 h-fit"
              >
                Política de Privacidade
              </Link>
            </div>

            <div className="flex flex-col gap-5">
              <Link
                href="/cancelamento"
                className="text-accent-foreground hover:text-foreground/30 h-fit"
              >
                Política de Cancelamento
              </Link>

              <Link
                href="/reembolso"
                className="text-accent-foreground hover:text-foreground/30 h-fit"
              >
                Política de Reembolso
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <p className="w-full text-sm text-accent-foreground">
          © {currentYear} Snip. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
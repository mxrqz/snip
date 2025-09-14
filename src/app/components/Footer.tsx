'use client';

import Link from 'next/link';
import { SnipLogoCompleta } from './snip-logos';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-foreground/60 py-4 font-extralight border-t [border-image:linear-gradient(90deg,#fff0,#fff3_25%,#fff6_75%,#fff0)_1] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">

      <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full">
        {/* Main Content */}
        <div className="w-full flex flex-col gap-5 md:flex-row justify-between">

          {/* Left Column - Logo & Description */}
          <div className="flex flex-col gap-4 items-start">
            <SnipLogoCompleta className="h-8 fill-foreground" />

            <p className="max-w-md leading-relaxed text-sm">
              Encurtador de links profissional com analytics completos.
              Transforme URLs longas em links curtos e acompanhe o desempenho
              de suas campanhas em tempo real.
            </p>
          </div>

          {/* Right Column - Legal Links */}
          <div className="flex flex-col md:flex-row w-full md:w-fit items-center text-nowrap gap-5 md:gap-10 h-fit text-sm">
            <div className="w-full items-center md:items-start flex flex-col gap-5">
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

            <div className="w-full items-center md:items-start flex flex-col gap-5">
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
        <p className="w-full text-sm text-center md:text-start text-accent-foreground">
          © {currentYear} Snip. Todos os direitos reservados.
        </p>
      </div>
      
    </footer>
  );
}
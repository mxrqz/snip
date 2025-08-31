'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Clipboard, Link2, BarChart3, ArrowRight, ExternalLink } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

export function HowItWorks() {
  const { isSignedIn } = useUser()

  const steps = [
    {
      icon: Clipboard,
      title: 'Encurte URLs Instantaneamente',
      description: 'Cole qualquer link longo - páginas de produto, artigos, vídeos ou campanhas de marketing. Nossa tecnologia processa URLs em menos de 100ms para máxima produtividade.'
    },
    {
      icon: Link2,
      title: 'Gere Links Profissionais',
      description: 'Receba URLs curtas otimizadas para SEO e compartilhamento em redes sociais. Links limpos que aumentam taxa de cliques em até 300% comparado a URLs longas.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançados Gratuitos',
      description: 'Dashboard completo com métricas de cliques, geolocalização, dispositivos e referrers. Otimize suas campanhas digitais com dados precisos e em tempo real.'
    }
  ];

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Encurtador de Links Profissional
        </h2>
        <p className="text-lg text-white max-w-3xl mx-auto">
          Transforme URLs longas em links curtos poderosos. Aumente suas conversões com nossa plataforma de encurtamento de links gratuita, completa com analytics avançados e ferramentas de marketing digital.
        </p>
      </div>

      {/* Steps Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">

                
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-black" />
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute right-0 top-0 flex items-center h-full">
                      <ArrowRight className="translate-x-full" />
                    </div>
                  )}
                </div>

              
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-white leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div> */}

      <div className="flex gap-5 w-full items-center relative">
        <div className="flex flex-col justify-center rounded-2xl bg-foreground text-background w-full p-5 gap-3 relative overflow-hidden">
          <Clipboard className="size-8" />

          <div className="absolute w-32 h-full right-0 translate-x-1/2 opacity-15">
            <Image src={"/arrowRightOutline.png"} alt="arrowRight" fill className="object-contain" />
          </div>

          <h3 className="text-xl font-semibold">Encurte URLs Instantaneamente</h3>

          <p className="leading-relaxed">
            Cole qualquer link longo - páginas de produto, artigos, vídeos ou campanhas de marketing. Nossa tecnologia processa URLs em menos de 100ms para máxima produtividade.
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-foreground text-background w-full p-5 gap-3 relative overflow-hidden">
          <Link2 className="size-8" />

          <div className="absolute w-32 h-full right-0 translate-x-1/2 opacity-15">
            <Image src={"/arrowRightOutline.png"} alt="arrowRight" fill className="object-contain" />
          </div>

          <div className="absolute w-32 h-full left-0 -translate-x-1/2 opacity-15">
            <Image src={"/arrowRightOutline.png"} alt="arrowRight" fill className="object-contain" />
          </div>

          <h3 className="text-xl font-semibold">Gere Links Profissionais</h3>

          <p className="leading-relaxed">
            Receba URLs curtas otimizadas para SEO e compartilhamento em redes sociais. Links limpos que aumentam taxa de cliques em até 300% comparado a URLs longas.
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-foreground text-background w-full p-5 gap-3 relative overflow-hidden">
          <BarChart3 className="size-8" />

          <div className="absolute w-32 h-full left-0 -translate-x-1/2 opacity-15">
            <Image src={"/arrowRightOutline.png"} alt="arrowRight" fill className="object-contain" />
          </div>

          <h3 className="text-xl font-semibold">Analytics Avançados Gratuitos</h3>

          <p className="leading-relaxed">
            Dashboard completo com métricas de cliques, geolocalização, dispositivos e referrers. Otimize suas campanhas digitais com dados precisos e em tempo real.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        {/* <div className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold">
          Comece Agora - Setup em poucos segundos
        </div> */}

        <Link href={isSignedIn ? '/dashboard' : '/login'}>
          <Button className="bg-foreground text-background group/modal-btn relative overflow-hidden hover:bg-foreground">
            <span className="group-hover/modal-btn:translate-x-96 text-center transition duration-500">
              Comece Agora - Setup em poucos segundos
            </span>

            <div className="-translate-x-96 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500">
              <ExternalLink />
            </div>
          </Button>
        </Link>
      </div>
    </section>
  );
}
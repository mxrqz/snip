'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { BarChart3, QrCode, Zap, Calendar, Search } from 'lucide-react';
import Link from "next/link";

export function Features() {
  const { isSignedIn } = useUser()

  return (
    <section className="w-full flex gap-16 flex-col items-center">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Recursos Poderosos
        </h2>
        <p className="text-lg text-white max-w-2xl mx-auto">
          Tudo que você precisa para gerenciar seus links de forma profissional
        </p>
      </div>

      {/* Features Grid */}
      <div className="hidden md:flex flex-col w-full gap-8">
        <div className="flex gap-8 w-full">
          <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-neutral-950">
            <div className="mb-4">
              <Zap className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Criação Instantânea
            </h3>

            <p className="leading-relaxed">
              Cole sua URL e receba o link encurtado instantaneamente. Interface simples e direta.
            </p>
          </div>

          <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-neutral-950">
            <div className="mb-4">
              <BarChart3 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Analytics Detalhados
            </h3>

            <p className="leading-relaxed">
              Gráficos de cliques por período, origem dos acessos, dispositivos e geolocalização dos usuários.
            </p>
          </div>

          <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-neutral-950">
            <div className="mb-4">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              QR Code Automático
            </h3>

            <p className="leading-relaxed">
              Todo link encurtado gera automaticamente um QR Code para compartilhamento offline.
            </p>
          </div>
        </div>

        <div className="flex gap-8 w-full">
          <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-neutral-950">
            <div className="mb-4">
              <Calendar className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Data de Expiração
            </h3>

            <p className="leading-relaxed">
              Configure quando seus links devem expirar. Perfeito para campanhas temporárias
            </p>
          </div>

          <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-neutral-950">
            <div className="mb-4">
              <Search className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Busca Avançada
            </h3>

            <p className="leading-relaxed">
              Encontre seus links rapidamente por URL original, data de criação ou número de cliques.
            </p>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-8 w-full">
        <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-foreground/5">
          <div className="mb-4">
            <Zap className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Criação Instantânea
          </h3>

          <p className="leading-relaxed">
            Cole sua URL e receba o link encurtado instantaneamente. Interface simples e direta.
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-foreground/5">
          <div className="mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Analytics Detalhados
          </h3>

          <p className="leading-relaxed">
            Gráficos de cliques por período, origem dos acessos, dispositivos e geolocalização dos usuários.
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-foreground/5">
          <div className="mb-4">
            <QrCode className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            QR Code Automático
          </h3>

          <p className="leading-relaxed">
            Todo link encurtado gera automaticamente um QR Code para compartilhamento offline.
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-foreground/5">
          <div className="mb-4">
            <Calendar className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Data de Expiração
          </h3>

          <p className="leading-relaxed">
            Configure quando seus links devem expirar. Perfeito para campanhas temporárias
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-foreground bg-gradient-to-t from-background to-foreground/5">
          <div className="mb-4">
            <Search className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Busca Avançada
          </h3>

          <p className="leading-relaxed">
            Encontre seus links rapidamente por URL original, data de criação ou número de cliques.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <Link href={isSignedIn ? '/dashboard' : '/login'}>
        <Button className="bg-foreground text-background group/modal-btn relative overflow-hidden hover:bg-foreground">
          <span className="group-hover/modal-btn:translate-x-96 text-center transition duration-500">
            Experimente todas as funcionalidades
          </span>

          <div className="-translate-x-96 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500">
            🚀
          </div>
        </Button>
      </Link>
    </section>
  );
}
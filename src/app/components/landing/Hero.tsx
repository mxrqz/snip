'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Spotlight from "../Spotlight";
import { useUser } from "@clerk/nextjs";

export function Hero() {
  const { isLoaded, isSignedIn } = useUser()

  return (
    <section className="flex flex-col md:flex-row gap-16 items-center w-full">
      {/* Left Column - Content */}
      <div className="text-left flex-1 w-full flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h1 className={`text-5xl font-bold text-white  leading-tight`}>
            Encurte. Compartilhe. Gerencie.
          </h1>

          <p className={`text-2xl text-white  leading-relaxed`}>
            Cole, clique e pronto.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={isLoaded && isSignedIn ? '/dashboard' : '/login'}>
            <Button size="lg" className="bg-white text-black hover:bg-gray-300 px-8 py-4 text-lg font-semibold">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="flex items-start  gap-8 text-foreground">
          <div>
            <span className="text-lg md:text-2xl font-bold">QR Code</span>
            <p className="text-sm">Para cada link</p>
          </div>

          <div>
            <span className="text-lg md:text-2xl font-bold">Analytics</span>
            <p className="text-sm">Completos</p>
          </div>

          <div>
            <span className="text-lg md:text-2xl font-bold">Grátis</span>
            <p className="text-sm">Para sempre</p>
          </div>
        </div>
      </div>

      {/* Right Column - Spotlight Demo */}
      <Spotlight isOpen={false} />
    </section>
  );
}
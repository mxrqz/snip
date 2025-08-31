'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { SnipLogoCompleta, SnipLogoS } from "../snip-logos";

export function CTASection() {
  const [email, setEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleGetStarted = () => {
    if (email.trim()) {
      toast.success('Redirecionando para o cadastro!');
      // In a real app, you might save the email and redirect to signup with pre-filled email
    }
  };

  const handleNewsletterSignup = () => {
    if (newsletterEmail.trim()) {
      toast.success('Email cadastrado! Você receberá novidades do Momentum.');
      setNewsletterEmail('');
    } else {
      toast.error('Digite um email válido');
    }
  };

  return (
    <section className="flex flex-col text-center gap-10 w-full py-12 bg-foreground rounded-2xl" id="newsletter">
      {/* Main CTA */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-5 items-baseline w-full justify-center">
          <h2 className="text-4xl md:text-6xl font-bold text-background">
            Fique por dentro das novidades
          </h2>

          <SnipLogoS className="h-12" />
        </div>

        <p className="text-xl text-background">
          Grandes novidades estão chegando! <br /> Receba updates exclusivos sobre o <Link href={"#"}><u>Momentum</u></Link> e nossos próximos lançamentos.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Input
            placeholder="Seu melhor email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-1/2 text-foreground bg-background border-none focus-visible:ring-0 placeholder:text-foreground"
          />

          <Button
            onClick={handleGetStarted}
            className="bg-black hover:bg-gray-800 text-white px-6"
          >
            Começar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Features List */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-black">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Setup em poucos segundos</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Sempre gratuito</span>
          </div>

          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Sem cartão de crédito</span>
          </div>
        </div>
      </div>
    </section>
  );
}
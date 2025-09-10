'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { SnipLogoS } from "../snip-logos";

export function CTASection() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSignup = async () => {
    if (!email.trim()) {
      toast.error('Digite um email válido');
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'landing-page'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Email cadastrado com sucesso!');
        setEmail('');
      } else {
        toast.error(data.error || 'Erro ao cadastrar email');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Erro ao cadastrar email. Tente novamente.');
    } finally {
      setIsSubscribing(false);
    }
  };


  return (
    <section className="flex flex-col text-center gap-10 w-full py-12 px-5 bg-foreground rounded-2xl" id="newsletter">
      {/* Main CTA */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-5 items-baseline w-full justify-center">
          <h2 className="text-3xl md:text-6xl font-bold text-background">
            Fique por dentro das novidades
          </h2>

          <SnipLogoS className="h-12 hidden md:block" />
        </div>

        <p className="text-xl text-background text-pretty">
          Grandes novidades estão chegando! <br /> Receba updates exclusivos sobre o <Link href={"#"}><u>Momentum</u></Link> e nossos próximos lançamentos.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full justify-center">
          <Input
            placeholder="Seu melhor email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNewsletterSignup();
              }
            }}
            className="w-full md:w-1/2 text-foreground bg-background border-none focus-visible:ring-0 placeholder:text-foreground"
          />

          <Button
            onClick={handleNewsletterSignup}
            disabled={isSubscribing}
            className="bg-black hover:bg-gray-800 text-white px-6 items-center disabled:opacity-50"
          >
            {isSubscribing ? 'Cadastrando...' : 'Assinar'}
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
'use client';

import { Star, Quote } from 'lucide-react';

export function SocialProof() {
  const testimonials = [
    {
      name: 'João Silva',
      role: 'CEO, TechStartup',
      content: 'O Snip revolucionou como compartilhamos links em nossa empresa. Analytics incríveis e super rápido.',
      rating: 5
    },
    {
      name: 'Maria Santos',
      role: 'Marketing Manager',
      content: 'Interface limpa e funcional. Conseguimos trackear todas nossas campanhas de marketing perfeitamente.',
      rating: 5
    },
    {
      name: 'Pedro Costa',
      role: 'Developer',
      content: 'API simples de usar e documentação excelente. Integrei em menos de 10 minutos.',
      rating: 5
    }
  ];



  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Funcionalidades Avançadas
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Recursos profissionais para otimizar seus links e campanhas
          </p>
        </div>

        {/* Advanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border-2 border-white"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-6 h-6 text-black" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-black fill-black" />
                ))}
              </div>

              {/* Content */}
              <p className="text-black mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Author */}
              <div>
                <div className="font-semibold text-black">
                  {testimonial.name}
                </div>
                <div className="text-black text-sm">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white text-black px-6 py-3 rounded-lg font-semibold">
            <span>🎯 Ideal para marketers, desenvolvedores e empresas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
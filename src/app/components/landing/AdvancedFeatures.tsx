'use client';

import { Button } from "@/components/ui/button";
import { FileUp, Tag, Lock, MapPin, BellRing } from 'lucide-react';

export default function AdvancedFeatures() {
    const features = [
        {
            icon: FileUp,
            title: 'Upload CSV',
            description: 'Encurte múltiplos links de uma vez importando arquivos CSV',
            badge: 'Em Breve'
        },
        {
            icon: Tag,
            title: 'Alias Personalizado',
            description: 'Crie links personalizados com seu nome ou marca',
            badge: 'Em Breve'
        },
        {
            icon: Lock,
            title: 'Links Privados',
            description: 'Proteja seus links com senhas para acesso restrito',
            badge: 'Em Breve'
        },
        {
            icon: MapPin,
            title: 'Geolocalização',
            description: 'Analytics detalhados de países e cidades dos cliques',
            badge: 'Em Breve'
        }
    ];

    return (
        <section className="flex flex-col items-center gap-16 w-full">
            {/* Section Header */}
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Funcionalidades Avançadas
                </h2>
                <p className="text-lg text-white max-w-3xl mx-auto">
                    Recursos profissionais que estão chegando para elevar seus links ao próximo nível
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="relative bg-white p-6 rounded-2xl border-2 border-white hover:bg-gray-50 transition-all duration-300 group"
                        >
                            {/* Badge */}
                            <div className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                                {feature.badge}
                            </div>

                            {/* Icon */}
                            <div className="mb-4">
                                <Icon className="w-8 h-8 text-black" />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-black mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-black text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Bottom CTA */}

            <Button className="w-fit bg-foreground text-background hover:bg-foreground">
                <span>Seja notificado quando lançarmos</span>
                <BellRing />
            </Button>
        </section>
    );
}


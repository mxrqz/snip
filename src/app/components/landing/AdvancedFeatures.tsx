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
                            className="relative rounded-2xl overflow-hidden border border-foreground/30"
                        >
                            {/* Badge */}
                            <div className="w-full top-0 left-0 flex justify-end">
                                <span className="bg-foreground rounded-tr-md w-full" />

                                {/* <span className="absolute top-0 right-0 bg-foreground rounded-tr-3xl p-1 shrink-0">
                                    {feature.badge}
                                </span> */}

                                <span className="bg-foreground py-1 px-2 rounded-tr-3xl shrink-0 relative z-10 before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:right-0 before:bg-background before:-z-10 before:rounded-bl-md before:rounded-tr-2xl ">
                                    {feature.badge}
                                </span>
                            </div>

                            <div className="bg-foreground pb-6 px-6">
                                {/* Icon */}
                                <div className="mb-4 bg-foreground">
                                    <Icon className="w-8 h-8 text-background" />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold bg-foreground text-background mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-background bg-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
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


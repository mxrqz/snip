"use client"

import { Hero } from '@/app/components/landing/Hero';
import { HowItWorks } from '@/app/components/landing/HowItWorks';
import { Features } from '@/app/components/landing/Features';
// import { SocialProof } from '@/app/components/landing/SocialProof';
import { CTASection } from '@/app/components/landing/CTASection';

import { useSpotlightShortcut } from '@/app/hooks/useShortcuts';
import SpotlightDialog from "@/app/components/SpotlightDialog";
import { useState } from "react";


import AdvancedFeatures from "./components/landing/AdvancedFeatures";


export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useSpotlightShortcut(() => {
    setIsOpen(!isOpen)
  });

  return (
    <main className={`bg-background relative flex flex-col gap-32 md:gap-48 items-center w-full md:max-w-7xl md:mx-auto py-20 px-10 md:px-0`}>
      <Hero />
      <HowItWorks />
      <Features />
      <AdvancedFeatures />
      {/* <SocialProof /> */}
      <CTASection />

      <SpotlightDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}

'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import ModernCareSection from '@/sections/ModernCareSection';
import ImpactDataSection from '@/sections/ImpactDataSection';
import TreatmentSpectrumSection from '@/sections/TreatmentSpectrumSection';
import ClinicalResearchSection from '@/sections/ClinicalResearchSection';
import useLenis from '@/hooks/useLenis';

export default function Home() {
  useLenis();

  return (
    <div className="relative">
      <Navigation />
      <main>
        <HeroSection />
        <ModernCareSection />
        <ImpactDataSection />
        <TreatmentSpectrumSection />
        <ClinicalResearchSection />
      </main>
      <Footer />
    </div>
  );
}

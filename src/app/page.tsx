'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import AudioDemo from '@/components/audio-demo';
import PainCalculator from '@/components/pain-calculator';
import Features from '@/components/features';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';
import DemoModal from '@/components/demo-modal';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      <Hero onDemoClick={() => setShowDemo(true)} />
      <AudioDemo />
      <PainCalculator />
      <Features />
      <Pricing />
      <Footer />
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </main>
  );
}

'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import PainSection from '@/components/pain-section';
import PainCalculator from '@/components/pain-calculator';
import AudioDemo from '@/components/audio-demo';
import HowItWorks from '@/components/how-it-works';
import Features from '@/components/features';
import TrustSection from '@/components/trust-section';
import CTA from '@/components/cta';
import Footer from '@/components/footer';
import DemoModal from '@/components/demo-modal';
import BookingModal from '@/components/booking-modal';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation onBookingClick={() => setShowBooking(true)} />

      {/* 1. Hero (problem + single CTA) */}
      <Hero onDemoClick={() => setShowBooking(true)} />

      {/* 2. Pain section — "What happens when you can't answer?" */}
      <PainSection />

      {/* 3. ROI Calculator */}
      <PainCalculator />

      {/* 4. Demo audio player */}
      <AudioDemo />

      {/* 5. How it works section */}
      <HowItWorks onBookingClick={() => setShowBooking(true)} />

      {/* 6. Features */}
      <Features />

      {/* 7. Trust Section */}
      <TrustSection />

      {/* 8. Final CTA */}
      <CTA onBookingClick={() => setShowBooking(true)} />

      {/* 9. Footer */}
      <Footer />

      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </main>
  );
}

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
import BookingModal from '@/components/booking-modal';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation onBookingClick={() => setShowBooking(true)} />
      <Hero onDemoClick={() => setShowDemo(true)} />
      <AudioDemo />
      <PainCalculator />
      <Features />
      <Pricing />
      <Footer />
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </main>
  );
}

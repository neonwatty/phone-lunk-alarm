'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import PhoneDetector from '@/components/PhoneDetector'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Detect if running in Capacitor (mobile app)
    if (typeof window !== 'undefined' && 'Capacitor' in window) {
      router.replace('/mobile');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300"
         style={{ backgroundColor: 'transparent' }}>
      <Header />

      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <PhoneDetector />
      </main>

      <Footer />
    </div>
  )
}

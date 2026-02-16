import { redirect } from 'next/navigation'

import { getUserOrNull } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import PhoneDetector from '@/components/PhoneDetector'

export default async function HomePage() {
  const user = await getUserOrNull()

  if (user) {
    redirect('/kiosk/create')
  }

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300"
         style={{ backgroundColor: 'transparent' }}>
      <Header />

      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <div id="demo">
          <PhoneDetector />
        </div>
      </main>

      <Footer />
    </div>
  )
}

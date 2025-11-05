import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import PhoneDetector from '@/components/PhoneDetector'

export default function Home() {
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

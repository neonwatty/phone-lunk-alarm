import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PhoneDetector from '@/components/PhoneDetector'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/demo')

export default function DemoPage() {
  return (
    <div className="detector-page min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-4 pt-8 sm:pt-12 pb-0 text-center">
          <h1 className="heading-xl mb-3">Phone Lunk Detector</h1>
        </section>
        <PhoneDetector
          heading="Catch phone lunks in the act."
          compact
          trackingLocation="demo_page"
        />
      </main>
      <Footer />
    </div>
  )
}

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
          <h1 className="heading-xl mb-3">Phone detector</h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Point your camera toward a phone. When one is detected, an alarm sounds on your device.
          </p>
        </section>
        <PhoneDetector
          heading="Launch the detector"
          intro="Hold up a phone to test real-time detection. Results depend on lighting, camera angle, and model confidence."
          compact
          showIntroLinks
        />
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PhoneDetector from '@/components/PhoneDetector'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/demo')

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-6 text-center">
          <h1 className="heading-xl mb-6">AI Phone Detector Demo for Gyms</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Phone Lunk uses browser-based object detection to show how gym phone-use alerts could work.
            The demo runs locally, asks for camera permission, and does not upload your camera feed.
          </p>
        </section>
        <PhoneDetector
          heading="Try the Phone Lunk Demo"
          intro="Hold up a phone to test real-time detection. Results depend on lighting, camera angle, and model confidence."
          showIntroLinks
        />
      </main>
      <Footer />
    </div>
  )
}

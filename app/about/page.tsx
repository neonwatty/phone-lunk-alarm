import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata('/about')

export default function About() {
  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: 'transparent' }}>
      <Header />

      <main className="mb-10 flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-4">About Phone Lunk</h1>
            <p className="text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Phone Lunk is a side-project by Jeremy Watt: part AI demo, part gym etiquette joke, and part product sketch for a privacy-first gym kiosk.
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              The demo uses browser-based object detection to spot phones on camera and trigger a deliberately over-the-top alarm workflow. It is built as a practical sketch of how gyms could discourage equipment hogging without uploading camera feeds or storing footage by default.
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              The broader Phone Lunk concept is simple: keep the detection local, make the interaction obvious, and give gym operators a lighter way to communicate phone policies without turning the weight room into a surveillance product.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

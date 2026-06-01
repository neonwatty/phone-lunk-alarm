import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PilotInterestForm from '@/components/PilotInterestForm'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/waitlist')

export default function WaitlistPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-16">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="heading-xl mb-6">Bring Phone Lunk to Your Gym</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Phone Lunk is a working browser demo and a pilot concept for gyms that want a memorable,
            privacy-first way to discourage phone scrolling on equipment.
          </p>
        </section>

        <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          {[
            ['Gym TV Scoreboard', 'A kiosk display could show anonymous detection counts, recent catches, and a QR code for members to join.'],
            ['Owner Moderation', 'A real pilot should give staff control over what appears publicly, sensitivity settings, and instant shutdown controls.'],
            ['Privacy-First Events', 'The pilot concept is based on lightweight detection events, not uploaded camera feeds or stored face images.'],
          ].map(([title, description]) => (
            <article key={title} className="card">
              <h2 className="text-xl font-bold mb-3">{title}</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
            </article>
          ))}
        </section>

        <PilotInterestForm />

        <section className="max-w-3xl mx-auto card mt-12">
          <h2 className="heading-md mb-4">What exists today?</h2>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            The browser demo detects phones locally and shows the core interaction. The kiosk, badge,
            moderation, and live gym pilot workflow are product concepts that need a real gym partner
            before they become production features.
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            If you operate a gym and want to explore the idea, email the builder and include your gym type,
            location, and what phone-use problem you are trying to solve.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/privacy')

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Privacy and Camera Safety"
        intro="Phone Lunk is funny because it feels loud, but camera privacy has to be boringly clear."
        sections={[
          {
            heading: 'The demo runs in your browser',
            paragraphs: [
              'The current Phone Lunk demo asks for camera access so the browser can analyze frames on your device. The demo does not upload your live camera feed to Phone Lunk.',
              'Detection quality depends on lighting, angle, device performance, and model confidence. It is a prototype, not a production security system.',
            ],
          },
          {
            heading: 'What a real gym pilot would need',
            paragraphs: [
              'A gym deployment should avoid public personal media by default. The safer product shape is anonymous detection events, staff moderation, and aggregate counts.',
              'Any public screen should be controlled by the gym owner, with sensitivity settings, a moderation queue, and an instant off switch.',
            ],
            bullets: [
              'No face storage by default.',
              'No member accounts required for simple participation.',
              'Clear signage before any pilot runs in a real gym.',
              'Staff review before anything sensitive appears publicly.',
            ],
          },
        ]}
        cta={{
          title: 'Try the browser demo',
          body: 'See the interaction locally before thinking about a gym pilot.',
          href: '/demo',
          label: 'Open the demo',
        }}
      />
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/gym-tv-kiosk')

export default function GymTvKioskPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Gym TV Kiosk Concept for Phone Lunk Detection"
        intro="The long-term Phone Lunk idea is not a secret camera feed. It is a visible, moderated gym TV concept that turns equipment hogging into an anonymous scoreboard."
        sections={[
          {
            heading: 'The kiosk concept',
            paragraphs: [
              'A gym TV kiosk would show the gym name, an all-clear state, a QR code, and a daily count of anonymous phone-lunk detections. When a detection event arrives, the screen can flash the joke without showing identifying personal media.',
              'The kiosk is meant to create a social norm: keep sets moving, step away for long scrolling, and respect shared equipment.',
            ],
          },
          {
            heading: 'How a member would join',
            paragraphs: [
              'A member scans a QR code on the kiosk, opens a lightweight detector flow, and sends anonymous detection events to that gym room. No account should be required for the simple participation flow.',
              'A production version should make the privacy model visible before anyone joins.',
            ],
          },
          {
            heading: 'Owner controls and moderation',
            paragraphs: [
              'The gym owner needs the boring controls: moderation queue, sensitivity settings, on/off switch, staff-only admin view, and signage guidance.',
              'That control layer is what separates a funny prototype from something a real gym could responsibly test.',
            ],
          },
          {
            heading: 'Why the badge matters',
            paragraphs: [
              'A Phone Lunk Protected badge could give participating gyms a small, linkable artifact for their website. That badge is part product surface, part organic growth loop, and part reminder that the gym takes equipment flow seriously.',
            ],
          },
        ]}
        cta={{
          title: 'Interested in a pilot?',
          body: 'See the gym-owner pilot page and share what kind of gym you operate.',
          href: '/waitlist',
          label: 'View pilot details',
        }}
      />
      <Footer />
    </>
  )
}

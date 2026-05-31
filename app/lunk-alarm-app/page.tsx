import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/lunk-alarm-app')

export default function LunkAlarmAppPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Lunk Alarm App Concept for Phone Use at Gyms"
        intro="Phone Lunk takes the spirit of a lunk alarm and points it at a modern gym annoyance: camping on equipment while scrolling."
        sections={[
          {
            heading: 'What is a lunk alarm app?',
            paragraphs: [
              'A lunk alarm app is a playful way to call attention to gym behavior that disrupts other members. Phone Lunk focuses on phone use around shared equipment instead of grunting, dropping weights, or classic gym stereotypes.',
              'The joke works because everyone knows the scene: someone sits on a machine, opens their phone, and the rest of the floor quietly waits.',
            ],
          },
          {
            heading: 'What Phone Lunk does today',
            paragraphs: [
              'The current app is a browser-based AI demo. It asks for camera access, runs object detection locally, and triggers an alarm-style overlay when it sees a phone.',
              'It is not a production enforcement system. It is a working prototype and a shareable product sketch for gyms that want a fun way to talk about etiquette.',
            ],
          },
          {
            heading: 'What a gym-ready version would need',
            paragraphs: [
              'A real gym version should be calmer and more controlled than the joke. It needs owner moderation, privacy controls, clear signage, and aggregate detection events instead of public personal media.',
            ],
            bullets: [
              'A gym TV kiosk with an all-clear state and session counter.',
              'A QR flow for anonymous member participation.',
              'Moderation before anything appears publicly.',
              'A privacy-first design that avoids storing face images or live camera feeds.',
            ],
          },
        ]}
        cta={{
          title: 'Try the AI detector',
          body: 'Run the browser demo and see the core interaction yourself.',
          href: '/demo',
          label: 'Open Phone Lunk',
        }}
      />
      <Footer />
    </>
  )
}

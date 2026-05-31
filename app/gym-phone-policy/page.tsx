import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/gym-phone-policy')

export default function GymPhonePolicyPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Gym Phone Policy Guide and Sample Rules"
        intro="A good gym phone policy should protect member focus, privacy, and equipment flow without turning staff into hall monitors."
        sections={[
          {
            heading: 'What the policy should cover',
            paragraphs: [
              'Phones are part of modern training: members track workouts, film form checks, follow programs, and message coaches. The problem is not phone ownership; it is blocking equipment while scrolling or filming others without consent.',
              'The clearest policies separate useful phone use from behavior that affects other members.',
            ],
            bullets: [
              'Use phones for workout tracking between sets without occupying equipment longer than needed.',
              'Step away from benches, racks, and machines for long calls, texting, or scrolling.',
              'Get consent before filming anyone else.',
              'Keep tripods and filming setups out of walkways.',
            ],
          },
          {
            heading: 'Sample gym phone policy',
            paragraphs: [
              'Please keep phone use respectful and brief while using equipment. Track your workout, change music, or check your plan, then keep sets moving. If you need to text, scroll, take a call, or film multiple takes, step away from shared equipment so other members can train.',
              'Filming other members without consent is not allowed. Staff may ask members to move, pause filming, or share equipment when phone use slows down the floor.',
            ],
          },
          {
            heading: 'How Phone Lunk fits',
            paragraphs: [
              'Phone Lunk is not a replacement for a fair policy. It is a memorable demo and kiosk concept that helps gyms talk about the behavior everyone already recognizes: camping on equipment while scrolling.',
            ],
          },
        ]}
        cta={{
          title: 'See the phone detector demo',
          body: 'Try the playful AI demo behind the Phone Lunk concept.',
          href: '/demo',
          label: 'Try Phone Lunk',
        }}
      />
      <Footer />
    </>
  )
}

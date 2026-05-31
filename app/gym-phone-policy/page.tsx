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
        trackingLocation="gym_phone_policy"
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
            heading: 'Copy-paste policy variants',
            paragraphs: [
              'A phone policy works best when the tone matches the gym. A small studio can sound warmer and more conversational. A busy strength gym may need direct language near racks and benches. A campus or corporate gym may need privacy language that is easy for non-staff members to understand.',
              'Use the short version for signs, the medium version for member handbooks, and the strict version for areas where filming or long rests regularly block other members.',
            ],
            bullets: [
              'Short: Use phones for training tasks, then keep equipment moving. Step away for scrolling, calls, or long messages.',
              'Medium: Track workouts, adjust music, and check programs between sets. For texting, scrolling, calls, or repeated filming, move away from shared equipment so others can work in.',
              'Strict: Do not occupy benches, racks, machines, or walkways for phone use unrelated to the active set. Filming requires consent from anyone visible and may be paused by staff at any time.',
            ],
          },
          {
            heading: 'Staff script for friendly enforcement',
            paragraphs: [
              'Staff do not need to make the phone itself the issue. The cleanest script focuses on shared equipment: "Can you step off the bench while you finish that message? Someone is waiting to work in."',
              'When filming is involved, keep the script specific and calm: "You are welcome to film your set, but please make sure nobody else is in the frame and keep the tripod out of the walkway."',
            ],
          },
          {
            heading: 'Signage language',
            paragraphs: [
              'Good signage should be short enough to read while walking. Avoid a wall of rules. Put the clearest reminder near the equipment that creates the most friction.',
            ],
            bullets: [
              'Track your workout. Skip the scroll.',
              'Need to text? Step away from the rack.',
              'Film your set, not other members.',
              'Rest between sets. Do not camp between texts.',
            ],
          },
          {
            heading: 'How Phone Lunk fits',
            paragraphs: [
              'Phone Lunk is not a replacement for a fair policy. It is a memorable demo and kiosk concept that helps gyms talk about the behavior everyone already recognizes: camping on equipment while scrolling.',
            ],
          },
        ]}
        relatedLinks={[
          {
            href: '/phone-use-at-gym',
            label: 'Phone use at the gym',
            description: 'A member-friendly guide for texting, scrolling, filming, and workout tracking.',
          },
          {
            href: '/gym-equipment-hogging',
            label: 'Equipment hogging fixes',
            description: 'How phone habits affect benches, racks, machines, and perceived crowding.',
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

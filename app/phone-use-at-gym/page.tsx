import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/phone-use-at-gym')

export default function PhoneUseAtGymPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Phone Use at the Gym: Etiquette Guide"
        intro="Phones belong in modern workouts. The friction starts when tracking, texting, scrolling, or filming blocks shared equipment or makes other members feel watched."
        trackingLocation="phone_use_at_gym"
        sections={[
          {
            heading: 'What phone use is usually fine',
            paragraphs: [
              'Most members use phones for legitimate training reasons: timers, workout logs, music, form notes, coach messages, and program instructions. A useful etiquette guide should make room for that reality instead of pretending phones can disappear from the floor.',
              'The simple rule is to keep the phone task connected to the workout and keep the equipment available.',
            ],
            bullets: [
              'Check your program or log your set between active work.',
              'Change music or start a timer quickly.',
              'Film a set when the area is clear and the camera is not pointed at other members.',
              'Step away from shared equipment for longer messages, calls, or scrolling.',
            ],
          },
          {
            heading: 'When phone use becomes a problem',
            paragraphs: [
              'The same phone habit can feel harmless in an empty gym and rude during peak hours. Context matters. If someone is waiting, a long screen break on a bench or rack becomes an equipment-flow problem.',
              'Filming creates a second issue: privacy. Members should not have to wonder whether they are in the background of someone else\'s video.',
            ],
            bullets: [
              'Scrolling while occupying a high-demand station.',
              'Taking calls on equipment instead of stepping aside.',
              'Setting up tripods in walkways or crowded zones.',
              'Filming people who did not consent to be in the shot.',
            ],
          },
          {
            heading: 'A member-friendly rule of thumb',
            paragraphs: [
              'Use the phone for the workout. Step away for everything else. That one sentence is easier to remember than a long policy and gives staff a clear way to redirect behavior.',
              'For gyms, the best reminders sound social rather than punitive. The goal is a floor that moves smoothly, not a confrontation about every notification.',
            ],
          },
          {
            heading: 'How gyms can communicate it',
            paragraphs: [
              'Put the clearest reminders near benches, racks, cable stations, and other equipment that creates bottlenecks. Reinforce the policy in onboarding and make staff scripts consistent.',
              'Humor can help when the behavior is already recognizable. Phone Lunk uses the joke as the hook, then points back to a serious idea: keep shared equipment moving and respect member privacy.',
            ],
          },
        ]}
        relatedLinks={[
          {
            href: '/gym-phone-policy',
            label: 'Gym phone policy guide',
            description: 'Sample policy language, staff scripts, and signage copy for operators.',
          },
          {
            href: '/gym-equipment-hogging',
            label: 'Gym equipment hogging',
            description: 'How phone scrolling affects equipment flow and what gyms can do about it.',
          },
          {
            href: '/privacy',
            label: 'Camera privacy',
            description: 'How the current browser demo handles camera access and local processing.',
          },
          {
            href: '/gym-tv-kiosk',
            label: 'Gym TV kiosk concept',
            description: 'A pilot concept for anonymous detection events and staff-controlled displays.',
          },
        ]}
        cta={{
          title: 'Try the playful demo',
          body: 'See how Phone Lunk turns a recognizable gym habit into a browser-based AI demo.',
          href: '/demo',
          label: 'Open the demo',
        }}
      />
      <Footer />
    </>
  )
}

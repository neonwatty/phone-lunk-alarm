import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/gym-equipment-hogging')

export default function GymEquipmentHoggingPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Gym Equipment Hogging: Causes and Fixes"
        intro="Equipment hogging is one of those gym problems that feels small until enough members hit the same bottleneck every week."
        sections={[
          {
            heading: 'Why equipment hogging feels so frustrating',
            paragraphs: [
              'Most gyms have a few high-demand zones: benches, squat racks, cable machines, and popular plate-loaded equipment. When one member camps there without actively training, the whole floor feels slower.',
              'The frustration is not only about time. Members can start to feel that the gym is unmanaged, unfair, or too crowded even when the real problem is equipment flow.',
            ],
          },
          {
            heading: 'How phone use makes it worse',
            paragraphs: [
              'Phones are useful for workout tracking, music, timers, coaching, and form checks. The problem starts when a quick glance turns into scrolling while someone else waits.',
              'That behavior is hard for staff to address because it can look harmless from across the room. A clear policy, visible reminders, and a little humor can make the norm easier to enforce.',
            ],
          },
          {
            heading: 'Practical ways gyms can reduce it',
            paragraphs: [
              'Gyms do not need to ban phones to improve equipment flow. The best approach is to define the behavior that causes friction and give staff a friendly script for addressing it.',
            ],
            bullets: [
              'Post simple time and sharing expectations near high-demand machines.',
              'Train staff to intervene politely before frustration escalates.',
              'Designate areas for longer calls, filming, or texting.',
              'Use humorous reminders so the rule feels social instead of punitive.',
            ],
          },
        ]}
        cta={{
          title: 'Write a clearer phone policy',
          body: 'Start with a practical policy members can understand in one read.',
          href: '/gym-phone-policy',
          label: 'Open the policy guide',
        }}
      />
      <Footer />
    </>
  )
}

import PhoneDetector from '@/components/PhoneDetector'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata('/demo')

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <PhoneDetector />
    </main>
  )
}

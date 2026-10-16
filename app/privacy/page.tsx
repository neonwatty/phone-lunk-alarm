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
        intro="Camera access is under your control. Phone Lunk processes camera frames directly in your browser."
        sections={[
          {
            heading: 'The demo runs in your browser',
            paragraphs: [
              'The current Phone Lunk demo asks for camera access so the browser can analyze frames on your device. The demo does not upload your live camera feed to Phone Lunk.',
              'Detection quality depends on lighting, angle, device performance, and model confidence. It is a prototype, not a production security system.',
            ],
          },
          {
            heading: 'You control camera access and recording',
            paragraphs: [
              'The camera starts only after you choose to enable it and grant browser permission. Use Stop Camera to end the camera session.',
              'Recording is optional. If you start a recording, the app creates a video on your device that you can preview and download. Sharing or uploading that file is a separate action.',
              'Use the camera only where recording is permitted and respect the privacy of people around you.',
            ],
          },
        ]}
        cta={{
          title: 'Launch the detector',
          body: 'Open the camera and detect visible phones directly in your browser.',
          href: '/demo',
          label: 'Launch Phone Lunk',
        }}
      />
      <Footer />
    </>
  )
}

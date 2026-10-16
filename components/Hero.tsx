'use client'

import Link from 'next/link'
import siteConfig from '@/site.config.mjs'
import VideoMockup from './VideoMockup'
import { trackFunnelEvent } from '@/lib/funnel-events'

export default function Hero() {
  const { hero } = siteConfig
  return (
    <section className="landing-hero landing-width">
      <div className="landing-hero-copy">
        <p className="landing-eyebrow"><span /> REAL-TIME PHONE DETECTION</p>
        <h1>{hero.headline}</h1>
        <p className="landing-description">{hero.subheadline}</p>
        <Link href={hero.primaryCTA.href} className="landing-launch" onClick={() => trackFunnelEvent('cta_click', { location: 'hero_primary', href: hero.primaryCTA.href, label: hero.primaryCTA.text })}>
          {hero.primaryCTA.text}<span aria-hidden="true">↗</span>
        </Link>
        <p className="landing-caption">No installation. No account. Just your camera.</p>
      </div>
      <VideoMockup />
    </section>
  )
}

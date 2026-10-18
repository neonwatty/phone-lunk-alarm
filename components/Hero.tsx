'use client'

import Link from 'next/link'
import siteConfig from '@/site.config.mjs'
import VideoMockup from './VideoMockup'
import { trackFunnelEvent } from '@/lib/funnel-events'

export default function Hero() {
  const { hero } = siteConfig
  return (
    <section id="overview" className="landing-screen landing-hero-screen" aria-labelledby="overview-title">
      <div className="landing-hero landing-width">
      <div className="landing-hero-copy">
        <h1 id="overview-title">{hero.headline}</h1>
        <p className="landing-definition"><strong>Phone Lunk</strong> <span>(n.)</span> — Someone camping on gym equipment while scrolling.</p>
        <p className="landing-description">{hero.subheadline}</p>
        <Link href={hero.primaryCTA.href} className="landing-launch" onClick={() => trackFunnelEvent('cta_click', { location: 'hero_primary', href: hero.primaryCTA.href, label: hero.primaryCTA.text })}>
          {hero.primaryCTA.text}<span aria-hidden="true">↗</span>
        </Link>
        <p className="landing-caption">No account or installation required.</p>
      </div>
      <VideoMockup />
      </div>
    </section>
  )
}

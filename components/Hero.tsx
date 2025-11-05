import Link from 'next/link'
import siteConfig from '@/site.config.mjs'
import VideoMockup from './VideoMockup'

export default function Hero() {
  const { hero } = siteConfig

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 md:py-32">
      <div className="text-center">
        {/* Headline */}
        <h1 className="heading-xl mb-6 stagger-animation stagger-delay-1"
            style={{ color: 'var(--color-text-primary)' }}>
          {hero.headline}
        </h1>

        {/* Definition Box */}
        <div className="max-w-3xl mx-auto mb-6 stagger-animation stagger-delay-2">
          <div className="bg-[#F9F72E] text-[#A4278D] px-6 py-4 rounded-lg">
            <p className="text-sm md:text-base font-medium">
              <span className="italic">Phone Lunk (n.)</span> - Doom-scrolling equipment hog
            </p>
          </div>
        </div>

        {/* Subheadline */}
        <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto stagger-animation stagger-delay-3">
          {hero.subheadline.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < hero.subheadline.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center stagger-animation stagger-delay-4">
          <Link
            href={hero.primaryCTA.href}
            className="btn btn-primary w-full sm:w-auto"
          >
            {hero.primaryCTA.text}
          </Link>

          {hero.secondaryCTA && (
            <Link
              href={hero.secondaryCTA.href}
              className="btn btn-secondary w-full sm:w-auto"
            >
              {hero.secondaryCTA.text}
            </Link>
          )}

          <Link
            href="/waitlist?utm_source=waitlist"
            className="btn btn-primary w-full sm:w-auto"
          >
            Join the Waitlist
          </Link>
        </div>

        {/* Video Mockup Demo */}
        <div className="stagger-animation stagger-delay-5">
          <VideoMockup />
        </div>
      </div>
    </section>
  )
}

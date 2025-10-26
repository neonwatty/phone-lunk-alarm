import Link from 'next/link'
import siteConfig from '@/site.config.mjs'

export default function Hero() {
  const { hero } = siteConfig

  return (
    <section className="max-w-4xl mx-auto px-4 py-20 md:py-32">
      <div className="text-center">
        {/* Headline */}
        <h1 className="heading-xl mb-6 stagger-animation stagger-delay-1"
            style={{ color: 'var(--color-text-primary)' }}>
          {hero.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto stagger-animation stagger-delay-2"
           style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          {hero.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center stagger-animation stagger-delay-3">
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
        </div>

        {/* Optional Hero Image */}
        {hero.image && (
          <div className="mt-16 stagger-animation stagger-delay-4">
            <img
              src={hero.image}
              alt={hero.headline}
              className="rounded-xl shadow-2xl mx-auto"
              style={{ maxWidth: '800px', width: '100%' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

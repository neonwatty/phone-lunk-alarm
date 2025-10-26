import Link from 'next/link'
import siteConfig from '@/site.config.mjs'

export default function CTA() {
  const { cta } = siteConfig

  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <div className="rounded-2xl p-12 text-center"
           style={{
             background: 'var(--gradient-professional)',
             boxShadow: 'var(--shadow-professional)'
           }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--color-text-inverse)' }}>
          {cta.headline}
        </h2>

        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
           style={{
             color: 'rgba(255, 255, 255, 0.9)',
             lineHeight: '1.6'
           }}>
          {cta.description}
        </p>

        <Link
          href={cta.buttonHref}
          className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
          style={{
            background: 'var(--color-background-primary)',
            color: 'var(--color-accent-primary)',
            boxShadow: 'var(--shadow-large)'
          }}
        >
          {cta.buttonText}
        </Link>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { trackFunnelEvent } from '@/lib/funnel-events'

type ContentSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

type SeoContentPageProps = {
  title: string
  intro: string
  sections: ContentSection[]
  trackingLocation?: string
  relatedLinks?: Array<{
    href: string
    label: string
    description: string
  }>
  cta: {
    title: string
    body: string
    href: string
    label: string
  }
}

export default function SeoContentPage({
  title,
  intro,
  sections,
  trackingLocation = 'seo_content_page',
  relatedLinks = [],
  cta,
}: SeoContentPageProps) {
  return (
    <main className="min-h-screen px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="heading-xl mb-6">{title}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            {intro}
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <section key={`${section.heading}-${sectionIndex}`} className="card">
              <h2 className="heading-md mb-4">{section.heading}</h2>
              <div className="space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${section.heading}-paragraph-${paragraphIndex}`}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li key={`${section.heading}-bullet-${bulletIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        {relatedLinks.length > 0 && (
          <section className="mt-10">
            <h2 className="heading-md mb-4">Related guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="card block hover:opacity-80 transition-opacity">
                  <h3 className="text-lg font-bold mb-2">{link.label}</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <aside className="mt-10 card text-center">
          <h2 className="heading-md mb-3">{cta.title}</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {cta.body}
          </p>
          <Link
            className="btn btn-primary"
            href={cta.href}
            onClick={() =>
              trackFunnelEvent('guide_cta_click', {
                location: trackingLocation,
                href: cta.href,
                label: cta.label,
              })
            }
          >
            {cta.label}
          </Link>
        </aside>
      </article>
    </main>
  )
}

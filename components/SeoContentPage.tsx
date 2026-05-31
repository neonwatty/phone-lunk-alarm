import Link from 'next/link'

type ContentSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

type SeoContentPageProps = {
  title: string
  intro: string
  sections: ContentSection[]
  cta: {
    title: string
    body: string
    href: string
    label: string
  }
}

export default function SeoContentPage({ title, intro, sections, cta }: SeoContentPageProps) {
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

        <aside className="mt-10 card text-center">
          <h2 className="heading-md mb-3">{cta.title}</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {cta.body}
          </p>
          <Link className="btn btn-primary" href={cta.href}>
            {cta.label}
          </Link>
        </aside>
      </article>
    </main>
  )
}

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteConfig from '@/site.config.mjs'

export const metadata = {
  title: 'About',
  description: `Learn more about ${siteConfig.site.name}`,
}

export default function About() {
  const { author, site } = siteConfig

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <article className="max-w-3xl mx-auto px-4 py-20">
          <div className="mb-12">
            <h1 className="heading-xl mb-6"
                style={{ color: 'var(--color-text-primary)' }}>
              About {site.name}
            </h1>
            <p className="text-xl"
               style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
              {site.description}
            </p>
          </div>

          <div className="card mb-12">
            <h2 className="heading-md mb-4"
                style={{ color: 'var(--color-text-primary)' }}>
              About {author.name}
            </h2>

            <div className="mb-4">
              <p className="font-medium mb-2"
                 style={{ color: 'var(--color-text-secondary)' }}>
                {author.role}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                {author.bio}
              </p>
            </div>

            {author.email && (
              <div className="mt-6">
                <a
                  href={`mailto:${author.email}`}
                  className="btn btn-primary"
                >
                  Get in Touch
                </a>
              </div>
            )}
          </div>

          <div className="prose max-w-none"
               style={{ color: 'var(--color-text-secondary)' }}>
            <h2 style={{ color: 'var(--color-text-primary)' }}>
              Customize This Page
            </h2>
            <p>
              This is a template page. To customize it:
            </p>
            <ol>
              <li>Edit the content in <code>site.config.mjs</code></li>
              <li>Modify this page at <code>app/about/page.tsx</code></li>
              <li>Add more sections as needed</li>
            </ol>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

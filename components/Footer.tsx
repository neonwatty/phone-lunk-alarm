'use client'

import siteConfig from '@/site.config.mjs'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="transition-all duration-300"
            style={{
              background: 'var(--gradient-elevated)',
              borderTop: '1px solid var(--color-border-primary)',
              boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.02)'
            }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm transition-all duration-300">
          <div className="mb-6 sm:mb-0">
            <p className="font-medium transition-all duration-300"
               style={{
                 color: 'var(--color-text-secondary)',
                 letterSpacing: '-0.01em'
               }}>
              © {currentYear}{' '}
              {siteConfig.author.name}
            </p>
          </div>

          {/* Social links */}
          <div className="flex space-x-6"
               style={{ color: 'var(--color-text-tertiary)' }}>
            {siteConfig.social.twitter && (
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {siteConfig.social.blog && (
              <a
                href={siteConfig.social.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Blog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

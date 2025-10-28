import Header from '@/components/Header'
import Footer from '@/components/Footer'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-8">
            <p className="text-2xl font-bold px-6 py-4 rounded-lg inline-block"
               style={{
                 backgroundColor: 'var(--color-accent-light)',
                 color: 'var(--color-accent-primary)'
               }}>
              Wow you&apos;re an easy mark!
            </p>
          </div>

          {/* Description */}
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl max-w-3xl mx-auto"
               style={{ color: 'var(--color-text-secondary)' }}>
              This thing isn&apos;t real (yet)!
              <br />
              <br />
              <span className="font-bold px-6 py-4 rounded-lg inline-block"
                    style={{
                      backgroundColor: 'var(--color-accent-light)',
                      color: 'var(--color-accent-primary)'
                    }}>
                But this is: YTgify - a browser extension that lets you quickly clip GIFs from any YouTube video right in the player!
              </span>
            </p>
          </div>

          {/* YTgify Section */}
          <div className="space-y-8">
            <div className="text-center">
              {/* Chrome Web Store Badge */}
              <div className="mb-8">
                <a
                  href="https://chromewebstore.google.com/detail/ytgify/dnljofakogbecppbkmnoffppkfdmpfje"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-opacity hover:opacity-90"
                >
                  <img
                    src={`${basePath}/chrome-web-store-badge.png`}
                    alt="Available in the Chrome Web Store"
                    className="h-16 sm:h-20 w-auto"
                  />
                </a>
              </div>
            </div>

            {/* Demo Video with Arrow Indicator */}
            <div className="relative">
              {/* Heading with Finger Emojis */}
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold"
                    style={{ color: 'var(--color-text-primary)' }}>
                  👇 Check it out! 👇
                </h3>
              </div>

              {/* Video */}
              <div className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden"
                   style={{ boxShadow: 'var(--shadow-subtle)' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/hBBr8SluoQ8"
                  title="YTgify Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

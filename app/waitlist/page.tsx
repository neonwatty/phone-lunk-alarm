import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdrAJe0M7T6RhIQTu70es-5UOPqICZi_epAlw5x8PRCSvhJRQ/viewform'

export default function RevealPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* GOTCHA Header */}
          <div className="text-center mb-8 stagger-animation stagger-delay-1">
            <span className="text-6xl md:text-7xl">🚨</span>
            <h1
              className="text-4xl md:text-5xl font-bold mt-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              GOTCHA
            </h1>
          </div>

          {/* Punchline */}
          <div className="text-center mb-8 stagger-animation stagger-delay-2">
            <p
              className="text-xl md:text-2xl font-medium mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              OK, this isn&apos;t real.
            </p>
            <p
              className="text-lg md:text-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              I built it as a joke because I&apos;m tired of waiting for equipment at my gym.
            </p>
          </div>

          {/* The Twist */}
          <div className="text-center mb-10 stagger-animation stagger-delay-3">
            <p
              className="text-2xl md:text-3xl font-bold"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              But... should it be?
            </p>
          </div>

          {/* Build It For Real Section */}
          <div
            className="rounded-xl p-6 md:p-8 mb-10 stagger-animation stagger-delay-4"
            style={{
              background: 'var(--gradient-elevated)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <p
              className="text-lg font-medium mb-6 text-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              If you actually want this for your gym:
            </p>

            <div className="text-center">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2 text-lg"
              >
                Yes, actually build this
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>

            <p
              className="text-sm mt-6 text-center"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              I&apos;ll let you know if it becomes real. No promises, no spam.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10 stagger-animation stagger-delay-5">
            <div
              className="flex-1 h-px"
              style={{ background: 'var(--color-border-secondary)' }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: 'var(--color-border-secondary)' }}
            />
          </div>

          {/* Share Your L Section */}
          <div className="text-center stagger-animation stagger-delay-6">
            <p
              className="text-lg mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Just here for the meme? Share your L:
            </p>

            <ShareButtons />
          </div>

          {/* @neonwatty Branding */}
          <div className="text-center mt-12 pt-8 border-t stagger-animation stagger-delay-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <p
              className="text-sm mb-2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              built by
            </p>
            <a
              href="https://x.com/neonwatty"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold transition-colors hover:underline"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              @neonwatty
            </a>
            <p
              className="text-sm mt-2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              (follow for more dumb things)
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

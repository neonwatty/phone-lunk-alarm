import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

          {/* Card 1 — The Vision */}
          <div
            className="rounded-xl p-6 md:p-8 mb-6 stagger-animation stagger-delay-4"
            style={{
              background: 'var(--gradient-elevated)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <p
              className="text-lg font-medium mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Here&apos;s what I&apos;m thinking:
            </p>
            <p
              className="text-base mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              A gym mounts a TV running this AI. Members scan a QR code on the screen to join.
              Point your phone at anyone hogging equipment while scrolling — the AI detects the
              phone and the catch shows up on the gym&apos;s TV scoreboard in real-time.
            </p>
            <p
              className="text-lg font-semibold mb-4 text-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              &ldquo;34 phones caught today.&rdquo;
            </p>
            <p
              className="text-base"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              The detection already works — try it yourself at the top of this page.
              The kiosk part is what I&apos;d build next.
            </p>
          </div>

          {/* Card 2 — Privacy & Control */}
          <div
            className="rounded-xl p-6 md:p-8 mb-10 stagger-animation stagger-delay-5"
            style={{
              background: 'var(--gradient-elevated)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <p
              className="text-lg font-medium mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Built for gym owners, not chaos:
            </p>
            <ul
              className="space-y-3 text-base"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <li className="flex gap-2">
                <span className="shrink-0">—</span>
                <span>No faces, no photos — detection only counts phones, nothing identifiable is shown or stored</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">—</span>
                <span>Gym owner approves everything before it hits the TV — full moderation queue</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">—</span>
                <span>Members are anonymous — no accounts required, no personal data collected</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">—</span>
                <span>The gym owner controls all settings: what shows up, sensitivity, and can kill the feed instantly</span>
              </li>
            </ul>
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

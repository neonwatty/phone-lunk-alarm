import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold mb-4"
              style={{
                background: 'var(--gradient-professional)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            404
          </h1>

          <h2 className="heading-lg mb-6"
              style={{ color: 'var(--color-text-primary)' }}>
            Page Not Found
          </h2>

          <p className="text-lg mb-8 max-w-md mx-auto"
             style={{ color: 'var(--color-text-secondary)' }}>
            Sorry, we couldn't find the page you're looking for.
          </p>

          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

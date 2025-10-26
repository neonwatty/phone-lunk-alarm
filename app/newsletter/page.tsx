'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'

function NewsletterContent() {
  const searchParams = useSearchParams()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const isFromWaitlist = searchParams?.get('utm_source') === 'waitlist'
    setShowMessage(isFromWaitlist)
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300"
         style={{ backgroundColor: 'transparent' }}>
      <Header />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-20">
          {/* Waitlist Message */}
          {showMessage && (
            <div className="text-center mb-8">
              <p className="text-2xl font-bold px-6 py-4 rounded-lg inline-block"
                 style={{
                   backgroundColor: 'var(--color-accent-light)',
                   color: 'var(--color-accent-primary)'
                 }}>
                Wow you're an easy mark!
              </p>
            </div>
          )}

          {/* Newsletter Signup */}
          <Newsletter />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function NewsletterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col transition-all duration-300"
           style={{ backgroundColor: 'transparent' }}>
        <Header />
        <main className="flex-grow" />
        <Footer />
      </div>
    }>
      <NewsletterContent />
    </Suspense>
  )
}

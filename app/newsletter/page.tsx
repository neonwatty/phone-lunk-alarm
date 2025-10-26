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

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight transition-all duration-300"
                style={{
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.04em',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
              Stay in the Loop
            </h1>

            <div className="w-24 h-px mb-8 mx-auto transition-all duration-300"
                 style={{ background: 'var(--gradient-subtle)' }}></div>

            <p className="text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
               style={{ color: 'var(--color-text-secondary)' }}>
              Get updates on phone detection technology, gym culture insights, and lessons learned building AI-powered tools.
            </p>
          </div>

          {/* What You'll Get Section */}
          <div className="mb-16 p-8 rounded-2xl transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.05))',
                 border: '1px solid rgba(139, 92, 246, 0.2)',
               }}>
            <h2 className="text-2xl font-bold mb-6 text-center transition-all duration-300"
                style={{ color: 'var(--color-text-primary)' }}>
              What you'll get
            </h2>

            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-1"
                     style={{ color: 'var(--color-accent)' }}
                     fill="currentColor"
                     viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>New features</strong> — Be the first to know when new detection capabilities launch
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-1"
                     style={{ color: 'var(--color-accent)' }}
                     fill="currentColor"
                     viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Tech insights</strong> — How AI object detection works and improvements in accuracy
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-1"
                     style={{ color: 'var(--color-accent)' }}
                     fill="currentColor"
                     viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Build learnings</strong> — Real lessons from building browser-based AI detection tools
                </p>
              </div>
            </div>
          </div>

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

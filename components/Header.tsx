'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import siteConfig from '@/site.config.mjs'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md transition-all duration-300"
            style={{
              background: 'var(--gradient-elevated)',
              borderBottom: '1px solid var(--color-border-primary)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
      <nav className="max-w-4xl mx-auto px-4 py-4" aria-label="Top">
        <div className="flex items-center justify-between">
          {/* Logo/Site name */}
          <Link href="/" className="font-bold text-xl sm:text-2xl transition-all duration-300"
                style={{
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
            {siteConfig.site.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {siteConfig.navigation.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <Link
                  href={item.href}
                  className="text-sm lg:text-base font-medium transition-all duration-300 relative group whitespace-nowrap px-3 lg:px-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span className="group-hover:text-opacity-100 transition-all duration-300"
                        style={{
                          color: 'var(--color-text-secondary)'
                        }}>
                    {item.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                        style={{ background: 'var(--color-border-primary)' }}></span>
                </Link>
                {index < siteConfig.navigation.length - 1 && (
                  <div
                    className="h-4 w-px mx-1"
                    style={{ backgroundColor: 'var(--color-border-primary)' }}
                  />
                )}
              </div>
            ))}
            <div
              className="h-4 w-px mx-3 lg:mx-4"
              style={{ backgroundColor: 'var(--color-border-primary)' }}
            />
            <div className="scale-100 lg:scale-110">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md transition-all duration-300"
              style={{ color: 'var(--color-text-primary)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-3 border-t"
               style={{ borderColor: 'var(--color-border-primary)' }}>
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-md font-medium transition-all duration-300"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-background-secondary)'
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

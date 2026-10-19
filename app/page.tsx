import Link from 'next/link'
import { ViewfinderCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '@/components/ThemeToggle'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import JsonLd from '@/components/JsonLd'
import { buildSoftwareApplicationJsonLd, buildWebsiteJsonLd } from '@/lib/seo'
import siteConfig from '@/site.config.mjs'

export default function Home() {
  return (
    <div className="landing landing-home detector-page">
      <JsonLd data={buildWebsiteJsonLd()} /><JsonLd data={buildSoftwareApplicationJsonLd()} />
      <a className="landing-skip" href="#main">Skip to content</a>
      <header className="landing-navigation">
        <div className="landing-header landing-width">
        <Link href="/" className="landing-brand"><ViewfinderCircleIcon aria-hidden="true" />Phone Lunk<span className="brand-dot">.</span></Link>
        <nav aria-label="Main navigation">
          <div className="landing-section-links">
            <a href="#overview">Overview</a>
            <a href="#how-it-works">How it works</a>
            <a href="#privacy">Privacy</a>
          </div>
          <div className="landing-nav-actions">
            <Link href="/demo" className="nav-launch">Open app <span aria-hidden="true">↗</span></Link>
            <ThemeToggle />
          </div>
        </nav>
        </div>
      </header>
      <main id="main"><Hero /><HowItWorks />
        <section id="privacy" className="landing-screen landing-privacy-screen" aria-labelledby="privacy-title">
          <div className="landing-privacy landing-width">
          <div className="privacy-icon"><LockClosedIcon aria-hidden="true" /></div>
          <div><h2 id="privacy-title">Your camera. Your device.</h2><p>Camera frames are processed in your browser, without uploading your live feed. You control when the camera starts and stops.</p><Link href="/privacy">Read about privacy <span aria-hidden="true">↗</span></Link></div>
          <p className="privacy-note">Detects visible phones, not screen activity or time spent using them. Results depend on lighting and camera angle.</p>
          </div>
        </section>
      </main>
      <footer className="landing-footer landing-width"><p>Phone Lunk <span>© {new Date().getFullYear()}</span></p><div><Link href="/privacy">Privacy</Link><a href={siteConfig.social.blog} target="_blank" rel="noopener noreferrer">Built by {siteConfig.author.name} <span aria-hidden="true">↗</span></a></div></footer>
    </div>
  )
}

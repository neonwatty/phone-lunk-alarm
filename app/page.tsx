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
      <header className="landing-header landing-width">
        <Link href="/" className="landing-brand"><ViewfinderCircleIcon aria-hidden="true" />Phone Lunk<span className="brand-dot">.</span></Link>
        <nav aria-label="Main navigation"><Link href="#how-it-works" className="how-link">How it works</Link><Link href="/demo" className="nav-launch">Launch detector <span aria-hidden="true">↗</span></Link><ThemeToggle /></nav>
      </header>
      <main id="main"><Hero /><HowItWorks />
        <section className="landing-screen landing-privacy-screen" aria-labelledby="privacy-title">
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

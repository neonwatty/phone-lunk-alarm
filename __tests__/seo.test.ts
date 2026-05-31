import {
  CANONICAL_SITE_URL,
  buildCanonicalUrl,
  buildPageMetadata,
  pageMetadata,
} from '@/lib/seo'
import siteConfig from '@/site.config.mjs'
import type { PagePath } from '@/lib/seo'
import { metadata as aboutMetadata } from '@/app/about/page'
import { metadata as demoMetadata } from '@/app/demo/page'
import { metadata as waitlistMetadata } from '@/app/waitlist/page'

const sitemapConfig = require('../next-sitemap.config.js')

describe('seo helpers', () => {
  it('uses the www canonical domain', () => {
    expect(CANONICAL_SITE_URL).toBe('https://www.phone-lunk.app')
  })

  it('builds trailing-slash canonical URLs', () => {
    expect(buildCanonicalUrl('/')).toBe('https://www.phone-lunk.app/')
    expect(buildCanonicalUrl('/demo')).toBe('https://www.phone-lunk.app/demo/')
    expect(buildCanonicalUrl('gym-phone-policy')).toBe('https://www.phone-lunk.app/gym-phone-policy/')
  })

  it('defines unique metadata for core public routes', () => {
    const routes = ['/', '/demo', '/waitlist', '/privacy', '/gym-phone-policy', '/gym-equipment-hogging'] satisfies PagePath[]
    const titles = routes.map((route) => pageMetadata[route].title)
    const descriptions = routes.map((route) => pageMetadata[route].description)

    expect(new Set(titles).size).toBe(routes.length)
    expect(new Set(descriptions).size).toBe(routes.length)
    expect(pageMetadata['/demo'].title).toContain('AI Phone Detector Demo')
    expect(pageMetadata['/waitlist'].title).toContain('Gym Pilot')
  })

  it('keeps metadata paths aligned with route keys', () => {
    for (const [path, metadata] of Object.entries(pageMetadata)) {
      expect(metadata.path).toBe(path)
    }
  })

  it('builds page metadata with canonical, social URLs, and fallback images', () => {
    const metadata = buildPageMetadata('/demo')

    expect(metadata.alternates?.canonical).toBe('https://www.phone-lunk.app/demo/')
    expect(metadata.openGraph?.url).toBe('https://www.phone-lunk.app/demo/')
    expect(metadata.openGraph?.images).toEqual([
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Phone Detector Demo for Gyms | Phone Lunk screenshot',
      },
    ])
    expect(metadata.twitter?.images).toEqual(['/images/og-image.jpg'])
  })

  it('exports route-level metadata for current public pages to prevent root metadata inheritance', () => {
    expect(demoMetadata).toMatchObject(buildPageMetadata('/demo'))
    expect(waitlistMetadata).toMatchObject(buildPageMetadata('/waitlist'))
    expect(aboutMetadata).toMatchObject(buildPageMetadata('/about'))
  })

  it('uses canonical site config values and navigation', () => {
    expect(siteConfig.site).toMatchObject({
      name: 'Phone Lunk',
      tagline: 'AI Phone Detection Demo for Gyms',
      description: 'A playful AI phone detector demo for gyms exploring how privacy-first kiosk alerts could reduce equipment hogging and improve gym etiquette.',
      url: 'https://www.phone-lunk.app',
      keywords: [
        'gym phone detection',
        'AI phone detector demo',
        'lunk alarm app',
        'gym phone policy',
        'gym equipment hogging',
        'gym etiquette',
        'fitness technology',
      ],
    })
    expect(siteConfig.seo).toMatchObject({
      defaultTitle: pageMetadata['/'].title,
      description: pageMetadata['/'].description,
    })
    expect(siteConfig.navigation).toEqual([
      { name: 'Demo', href: '/demo' },
      { name: 'How It Works', href: '/#how-it-works' },
      { name: 'Phone Policy', href: '/gym-phone-policy' },
      { name: 'Kiosk Concept', href: '/gym-tv-kiosk' },
      { name: 'Gym Pilot', href: '/waitlist' },
    ])
  })

  it('uses privacy-first feature descriptions', () => {
    expect(siteConfig.features).toEqual([
      {
        title: 'AI-Powered Detection Demo',
        description: 'Runs object detection in the browser to show how phone-use alerts could work. The demo is playful, experimental, and transparent about its limits.',
        icon: 'camera',
      },
      {
        title: 'Gym Owner Pilot Concept',
        description: 'Imagine a moderated gym TV kiosk where anonymous detection events become a lightweight scoreboard instead of a confrontation.',
        icon: 'bell-alert',
      },
      {
        title: 'Equipment Flow Focus',
        description: 'Phone scrolling between sets can slow down benches, racks, and machines. Phone Lunk turns that everyday frustration into a measurable behavior.',
        icon: 'shield-check',
      },
      {
        title: 'Browser-Only Demo',
        description: 'The current demo processes camera frames locally in your browser. No live camera feed is uploaded by the demo.',
        icon: 'light-bulb',
      },
      {
        title: 'Member Etiquette Angle',
        description: 'Useful phone policies work best when they are clear, fair, and easy to explain. The demo gives gyms a memorable way to start that conversation.',
        icon: 'check-badge',
      },
      {
        title: 'Built for Shareability',
        description: 'The joke is the hook, but the product idea is serious: a privacy-first way to make equipment hogging visible without storing personal media.',
        icon: 'fire',
      },
    ])
  })

  it('uses canonical sitemap domain and route priorities', async () => {
    expect(sitemapConfig.siteUrl).toBe('https://www.phone-lunk.app')

    await expect(sitemapConfig.transform(sitemapConfig, '/demo')).resolves.toMatchObject({
      changefreq: 'weekly',
      priority: 0.9,
    })
    await expect(sitemapConfig.transform(sitemapConfig, '/privacy')).resolves.toMatchObject({
      changefreq: 'monthly',
      priority: 0.6,
    })

    for (const route of ['/gym-phone-policy', '/gym-equipment-hogging', '/lunk-alarm-app', '/gym-tv-kiosk']) {
      await expect(sitemapConfig.transform(sitemapConfig, route)).resolves.toMatchObject({
        changefreq: 'monthly',
        priority: 0.75,
      })
    }
  })
})

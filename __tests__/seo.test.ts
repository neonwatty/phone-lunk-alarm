import {
  CANONICAL_SITE_URL,
  buildCanonicalUrl,
  buildPageMetadata,
  pageMetadata,
} from '@/lib/seo'
import type { PagePath } from '@/lib/seo'

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
})

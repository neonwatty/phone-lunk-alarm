import {
  CANONICAL_SITE_URL,
  buildCanonicalUrl,
  pageMetadata,
} from '@/lib/seo'

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
    const routes = ['/', '/demo', '/waitlist', '/privacy', '/gym-phone-policy', '/gym-equipment-hogging']
    const titles = routes.map((route) => pageMetadata[route].title)
    const descriptions = routes.map((route) => pageMetadata[route].description)

    expect(new Set(titles).size).toBe(routes.length)
    expect(new Set(descriptions).size).toBe(routes.length)
    expect(pageMetadata['/demo'].title).toContain('AI Phone Detector Demo')
    expect(pageMetadata['/waitlist'].title).toContain('Gym Pilot')
  })
})

import type { Metadata } from 'next'

export const CANONICAL_SITE_URL = 'https://www.phone-lunk.app'

export type PageMetadata = {
  title: string
  description: string
  path: string
  image?: string
}

export const pageMetadata = {
  '/': {
    title: 'Phone Lunk - AI Phone Detection Demo for Gyms',
    description: 'Try a playful AI phone detector demo for gyms, then see how a privacy-first kiosk concept could help reduce equipment hogging.',
    path: '/',
  },
  '/demo': {
    title: 'AI Phone Detector Demo for Gyms | Phone Lunk',
    description: 'Test Phone Lunk in your browser: a local AI demo that detects phones on camera and shows how gym phone enforcement could work.',
    path: '/demo',
  },
  '/waitlist': {
    title: 'Gym Pilot Interest | Phone Lunk',
    description: 'Interested in a Phone Lunk gym pilot? See the kiosk scoreboard concept for gym owners, staff moderation, and privacy-first phone detection events.',
    path: '/waitlist',
  },
  '/about': {
    title: 'About the Builder | Phone Lunk',
    description: 'Learn who built Phone Lunk, why this AI gym phone detector demo exists, and what product ideas could come next.',
    path: '/about',
  },
  '/privacy': {
    title: 'Privacy and Camera Safety | Phone Lunk',
    description: 'How the Phone Lunk demo handles camera access, browser-only processing, and privacy expectations for any future gym kiosk pilot.',
    path: '/privacy',
  },
  '/gym-phone-policy': {
    title: 'Gym Phone Policy Guide and Sample Rules | Phone Lunk',
    description: 'A practical guide for gyms writing phone-use policies for equipment areas, member etiquette, filming, privacy, and enforcement.',
    path: '/gym-phone-policy',
  },
  '/gym-equipment-hogging': {
    title: 'Gym Equipment Hogging: Causes and Fixes | Phone Lunk',
    description: 'Why gym equipment hogging frustrates members, how phone use makes it worse, and what gyms can do to improve equipment flow.',
    path: '/gym-equipment-hogging',
  },
  '/lunk-alarm-app': {
    title: 'Lunk Alarm App Concept for Phone Use at Gyms | Phone Lunk',
    description: 'A playful lunk alarm app concept that detects phone use on gym equipment and turns gym etiquette into a shareable AI demo.',
    path: '/lunk-alarm-app',
  },
  '/gym-tv-kiosk': {
    title: 'Gym TV Kiosk Concept for Phone Lunk Detection | Phone Lunk',
    description: 'See the Phone Lunk Protected kiosk concept: QR joining, anonymous detection events, moderation, and a gym TV scoreboard.',
    path: '/gym-tv-kiosk',
  },
} satisfies Record<string, PageMetadata>

export type PagePath = keyof typeof pageMetadata

export function buildCanonicalUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`
  return `${CANONICAL_SITE_URL}${withSlash}`
}

export function buildPageMetadata(path: PagePath): Metadata {
  const meta: PageMetadata = pageMetadata[path]
  const image = meta.image ?? '/images/og-image.jpg'
  const canonical = buildCanonicalUrl(meta.path)

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Phone Lunk',
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${meta.title} screenshot`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image],
      creator: '@neonwatty',
      site: '@neonwatty',
    },
  }
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Phone Lunk',
    url: buildCanonicalUrl('/'),
    description: pageMetadata['/'].description,
    publisher: {
      '@type': 'Organization',
      name: 'Phone Lunk',
      url: buildCanonicalUrl('/'),
    },
    creator: {
      '@type': 'Person',
      name: 'Jeremy Watt',
      url: 'https://neonwatty.com/',
    },
  }
}

export function buildSoftwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Phone Lunk',
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Web',
    url: buildCanonicalUrl('/demo'),
    description: pageMetadata['/demo'].description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Person',
      name: 'Jeremy Watt',
      url: 'https://neonwatty.com/',
    },
  }
}

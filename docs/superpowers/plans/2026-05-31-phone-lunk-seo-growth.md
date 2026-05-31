# Phone Lunk SEO Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the first SEO growth pass for Phone Lunk: canonical technical SEO, clearer B2B-with-viral-demo positioning, route-specific metadata, structured data, a credible gym-owner pilot page, privacy/trust content, and focused evergreen search pages.

**Architecture:** Keep the current static-export Next.js App Router app. Add small shared SEO/content helpers so route metadata and internal links stay consistent, then update pages/components in place without introducing a CMS or backend. New SEO pages are static routes with local content and reusable presentational helpers.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Jest Testing Library, Playwright, next-sitemap, static export.

---

## File Structure

**Create:**
- `lib/seo.ts` - canonical URL, route metadata, and JSON-LD helper data.
- `components/JsonLd.tsx` - reusable JSON-LD script emitter.
- `components/SeoContentPage.tsx` - shared static content page layout for evergreen SEO pages.
- `app/privacy/page.tsx` - trust/privacy page.
- `app/gym-phone-policy/page.tsx` - practical phone policy guide.
- `app/gym-equipment-hogging/page.tsx` - equipment hogging explainer.
- `app/lunk-alarm-app/page.tsx` - branded lunk alarm app landing page.
- `app/gym-tv-kiosk/page.tsx` - kiosk concept page.
- `__tests__/seo.test.ts` - helper tests for canonical URLs and route metadata.
- `__tests__/SeoContentPage.test.tsx` - shared page layout rendering test.

**Modify:**
- `site.config.mjs` - canonical domain, safer product copy, navigation, keywords, package-level SEO defaults.
- `app/layout.tsx` - canonical metadata defaults and homepage-safe global metadata.
- `app/page.tsx` - homepage JSON-LD.
- `components/Hero.tsx` - B2B-facing but playful hero copy and safer CTAs.
- `components/HowItWorks.tsx` - prototype-aware copy.
- `components/Features.tsx` - remove risky proof claims.
- `components/PhoneDetector.tsx` - allow optional landing intro suppression or add demo H1 support only where needed.
- `app/demo/page.tsx` - standalone route metadata, H1, privacy explanation, internal links.
- `app/waitlist/page.tsx` - replace gotcha copy with gym-owner pilot interest page.
- `app/about/page.tsx` - remove broken image references or replace with text-only credible creator context.
- `components/Header.tsx` - navigation labels/links after new pages exist.
- `components/Footer.tsx` - add internal footer links to demo, privacy, and SEO pages.
- `next-sitemap.config.js` - canonical domain, route priorities, exclusions.
- `public/robots.txt` - do not edit manually if `next-sitemap` owns generation; verify generated output instead.
- `README.md` - replace template docs with Phone Lunk project docs.
- `package.json` - rename package and description/keywords.

---

### Task 1: Add SEO Helper Tests

**Files:**
- Create: `__tests__/seo.test.ts`
- Create: `lib/seo.ts`

- [ ] **Step 1: Write the failing helper tests**

Create `__tests__/seo.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- --runTestsByPath __tests__/seo.test.ts
```

Expected: FAIL because `lib/seo.ts` does not exist.

- [ ] **Step 3: Add the SEO helper implementation**

Create `lib/seo.ts`:

```ts
import type { Metadata } from 'next'

export const CANONICAL_SITE_URL = 'https://www.phone-lunk.app'

export type PageMetadata = {
  title: string
  description: string
  path: string
  image?: string
}

export const pageMetadata: Record<string, PageMetadata> = {
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
}

export function buildCanonicalUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`
  return `${CANONICAL_SITE_URL}${withSlash}`
}

export function buildPageMetadata(path: keyof typeof pageMetadata): Metadata {
  const meta = pageMetadata[path]
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
```

- [ ] **Step 4: Run the helper test to verify it passes**

Run:

```bash
npm test -- --runTestsByPath __tests__/seo.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/seo.ts __tests__/seo.test.ts
git commit -m "test: add SEO metadata helper coverage"
```

---

### Task 2: Wire Canonical Metadata and Site Config

**Files:**
- Modify: `site.config.mjs`
- Modify: `app/layout.tsx`
- Modify: `next-sitemap.config.js`
- Test: `__tests__/seo.test.ts`

- [ ] **Step 1: Update site config values**

In `site.config.mjs`, change the top site fields to:

```js
site: {
  name: 'Phone Lunk',
  tagline: 'AI Phone Detection Demo for Gyms',
  description: 'A playful AI phone detector demo for gyms exploring how privacy-first kiosk alerts could reduce equipment hogging and improve gym etiquette.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phone-lunk.app',
  keywords: [
    'gym phone detection',
    'AI phone detector demo',
    'lunk alarm app',
    'gym phone policy',
    'gym equipment hogging',
    'gym etiquette',
    'fitness technology'
  ],
},
```

Also update navigation:

```js
navigation: [
  { name: 'Demo', href: '/demo' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Phone Policy', href: '/gym-phone-policy' },
  { name: 'Kiosk Concept', href: '/gym-tv-kiosk' },
  { name: 'Gym Pilot', href: '/waitlist' },
],
```

Replace the risky feature descriptions in `site.config.mjs`:

```js
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
```

- [ ] **Step 2: Update layout metadata defaults**

In `app/layout.tsx`, import and use the SEO helpers:

```ts
import { CANONICAL_SITE_URL, buildCanonicalUrl, pageMetadata } from '@/lib/seo'
```

Set:

```ts
export const metadata: Metadata = {
  title: {
    default: pageMetadata['/'].title,
    template: '%s'
  },
  description: pageMetadata['/'].description,
  keywords: siteConfig.site.keywords,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  metadataBase: new URL(CANONICAL_SITE_URL),
  alternates: {
    canonical: buildCanonicalUrl('/'),
  },
  // keep existing icons, openGraph, twitter, robots
}
```

Update `openGraph.url` to `buildCanonicalUrl('/')`, `openGraph.title` to `pageMetadata['/'].title`, and `openGraph.description` to `pageMetadata['/'].description`.

Update `twitter.title` and `twitter.description` the same way.

- [ ] **Step 3: Update sitemap canonical domain**

In `next-sitemap.config.js`, set:

```js
siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phone-lunk.app',
```

Add priorities for the new routes:

```js
if (path === '/demo/' || path === '/demo') {
  priority = 0.9
  changefreq = 'weekly'
}

if (path === '/privacy/' || path === '/privacy') {
  priority = 0.6
  changefreq = 'monthly'
}

if (
  path === '/gym-phone-policy/' ||
  path === '/gym-phone-policy' ||
  path === '/gym-equipment-hogging/' ||
  path === '/gym-equipment-hogging' ||
  path === '/lunk-alarm-app/' ||
  path === '/lunk-alarm-app' ||
  path === '/gym-tv-kiosk/' ||
  path === '/gym-tv-kiosk'
) {
  priority = 0.75
  changefreq = 'monthly'
}
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test -- --runTestsByPath __tests__/seo.test.ts
npm run type-check
npm run build
```

Expected: all pass. Build may still report the existing lint warnings until a later task fixes them.

- [ ] **Step 5: Verify generated canonical and sitemap output**

Run:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('out/index.html','utf8'); console.log((html.match(/<link rel=\"canonical\"[^>]*>/)||['NO CANONICAL'])[0]);"
sed -n '1,80p' out/sitemap.xml
sed -n '1,80p' out/robots.txt
```

Expected:
- canonical contains `https://www.phone-lunk.app/`
- sitemap URLs start with `https://www.phone-lunk.app`
- robots sitemap points to `https://www.phone-lunk.app/sitemap.xml`

- [ ] **Step 6: Commit**

```bash
git add site.config.mjs app/layout.tsx next-sitemap.config.js __tests__/seo.test.ts
git commit -m "feat: standardize SEO metadata and canonical domain"
```

---

### Task 3: Add JSON-LD Infrastructure and Homepage Structured Data

**Files:**
- Create: `components/JsonLd.tsx`
- Modify: `app/page.tsx`
- Modify: `components/StructuredData.tsx` or delete after replacing usage
- Test: `__tests__/seo.test.ts`

- [ ] **Step 1: Add JSON-LD tests**

Append to `__tests__/seo.test.ts`:

```ts
import {
  buildWebsiteJsonLd,
  buildSoftwareApplicationJsonLd,
} from '@/lib/seo'

describe('structured data helpers', () => {
  it('builds website JSON-LD for the canonical domain', () => {
    expect(buildWebsiteJsonLd()).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Phone Lunk',
      url: 'https://www.phone-lunk.app/',
    })
  })

  it('builds software application JSON-LD for the demo', () => {
    expect(buildSoftwareApplicationJsonLd()).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Phone Lunk',
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Web',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --runTestsByPath __tests__/seo.test.ts
```

Expected: FAIL because JSON-LD helpers do not exist.

- [ ] **Step 3: Add JSON-LD helpers**

Append to `lib/seo.ts`:

```ts
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
```

- [ ] **Step 4: Add reusable JSON-LD component**

Create `components/JsonLd.tsx`:

```tsx
type JsonLdProps = {
  data: Record<string, unknown>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

- [ ] **Step 5: Add JSON-LD to homepage**

Modify `app/page.tsx`:

```tsx
import JsonLd from '@/components/JsonLd'
import { buildSoftwareApplicationJsonLd, buildWebsiteJsonLd } from '@/lib/seo'
```

Render inside the top-level `<div>` before `<Header />`:

```tsx
<JsonLd data={buildWebsiteJsonLd()} />
<JsonLd data={buildSoftwareApplicationJsonLd()} />
```

- [ ] **Step 6: Remove duplicate About structured data usage**

In `app/about/page.tsx`, remove:

```tsx
import StructuredData from '@/components/StructuredData'
```

Remove:

```tsx
<StructuredData type="website" />
```

Leave `components/StructuredData.tsx` in place for this task unless no imports remain and the next task deletes it.

- [ ] **Step 7: Run tests and inspect built HTML**

```bash
npm test -- --runTestsByPath __tests__/seo.test.ts
npm run build
node -e "const fs=require('fs'); const html=fs.readFileSync('out/index.html','utf8'); console.log((html.match(/application\\/ld\\+json/g)||[]).length);"
```

Expected:
- tests pass
- build passes
- homepage JSON-LD count is `2`

- [ ] **Step 8: Commit**

```bash
git add lib/seo.ts components/JsonLd.tsx app/page.tsx app/about/page.tsx __tests__/seo.test.ts
git commit -m "feat: add structured data for Phone Lunk"
```

---

### Task 4: Refresh Homepage Positioning and Claims

**Files:**
- Modify: `site.config.mjs`
- Modify: `components/Hero.tsx`
- Modify: `components/HowItWorks.tsx`
- Modify: `components/Features.tsx`
- Test: `__tests__/Hero.test.tsx`

- [ ] **Step 1: Update hero config copy**

In `site.config.mjs`, set:

```js
hero: {
  headline: 'Put Phone Lunks On Blast',
  subheadline: 'A playful AI phone detection demo for gyms tired of equipment hogging. Try the browser demo, then see how a privacy-first gym kiosk could make phone scrolling between sets impossible to ignore.',
  primaryCTA: {
    text: 'Try the Demo',
    href: '/demo',
  },
  secondaryCTA: {
    text: 'Gym Pilot Concept',
    href: '/waitlist',
  },
  image: null,
},
```

- [ ] **Step 2: Update hero definition and CTAs**

In `components/Hero.tsx`, replace the definition text with:

```tsx
<span className="italic">Phone Lunk (n.)</span> - Someone camping on gym equipment while scrolling
```

Replace the third CTA text/link with:

```tsx
<Link
  href="/gym-phone-policy"
  className="btn btn-secondary w-full sm:w-auto"
>
  Read the Phone Policy Guide
</Link>
```

- [ ] **Step 3: Update how-it-works config**

In `site.config.mjs`, set:

```js
howItWorks: {
  sectionTitle: 'How It Works',
  sectionSubtitle: 'A browser demo today, a privacy-first gym kiosk concept next',
  steps: [
    {
      number: 1,
      emoji: '📷',
      title: 'Run the Demo',
      description: 'Open the browser demo and allow camera access. The current prototype processes frames locally on your device.'
    },
    {
      number: 2,
      emoji: '🧠',
      title: 'Detect Phone Use',
      description: 'The AI model looks for phones in view and overlays a visible alert when it finds one. It is a demo, not a perfect enforcement system.'
    },
    {
      number: 3,
      emoji: '📺',
      title: 'Imagine the Kiosk',
      description: 'A real gym pilot would use anonymous detection events, owner moderation, and a TV scoreboard instead of storing personal camera feeds.'
    }
  ]
},
```

- [ ] **Step 4: Keep feature cards factual**

Confirm `site.config.mjs` no longer contains:

```text
No false positives
Planet Fitness Approved
corporate-tested
Enterprise phone detection solution
```

Use `rg`:

```bash
rg -n "No false positives|Planet Fitness Approved|corporate-tested|Enterprise phone detection" site.config.mjs components app
```

Expected: no matches.

- [ ] **Step 5: Run component tests**

```bash
npm test -- --runTestsByPath __tests__/Hero.test.tsx __tests__/Header.test.tsx
npm run build
```

Expected: tests and build pass.

- [ ] **Step 6: Commit**

```bash
git add site.config.mjs components/Hero.tsx components/HowItWorks.tsx components/Features.tsx __tests__/Hero.test.tsx
git commit -m "feat: refresh homepage SEO positioning"
```

---

### Task 5: Make the Demo Route a Standalone Landing Page

**Files:**
- Modify: `app/demo/page.tsx`
- Modify: `components/PhoneDetector.tsx`
- Test: `__tests__/PhoneDetector.test.tsx`

- [ ] **Step 1: Update `PhoneDetector` props without changing default homepage behavior**

In `components/PhoneDetector.tsx`, add above the component:

```tsx
type PhoneDetectorProps = {
  heading?: string
  intro?: string
  showIntroLinks?: boolean
}
```

Change:

```tsx
export default function PhoneDetector() {
```

to:

```tsx
export default function PhoneDetector({
  heading = 'Be The Alarm',
  intro = "Gym doesn't have Phone-Lunk yet? Take matters into your own hands",
  showIntroLinks = false,
}: PhoneDetectorProps) {
```

Replace the hard-coded H2 text:

```tsx
{heading}
```

Replace the hard-coded intro paragraph:

```tsx
{intro}
```

After the yellow privacy notice, add:

```tsx
{showIntroLinks && (
  <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 text-sm">
    <a className="underline" href="/privacy">How camera privacy works</a>
    <a className="underline" href="/waitlist">Gym owner pilot concept</a>
  </div>
)}
```

- [ ] **Step 2: Add route metadata and landing copy**

Replace `app/demo/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PhoneDetector from '@/components/PhoneDetector'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/demo')

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-6 text-center">
          <h1 className="heading-xl mb-6">AI Phone Detector Demo for Gyms</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Phone Lunk uses browser-based object detection to show how gym phone-use alerts could work.
            The demo runs locally, asks for camera permission, and does not upload your camera feed.
          </p>
        </section>
        <PhoneDetector
          heading="Try the Phone Lunk Demo"
          intro="Hold up a phone to test real-time detection. Results depend on lighting, camera angle, and model confidence."
          showIntroLinks
        />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Update tests for configurable heading**

In `__tests__/PhoneDetector.test.tsx`, add:

```tsx
it('renders a custom heading when provided', async () => {
  render(<PhoneDetector heading="Try the Phone Lunk Demo" />)

  expect(screen.getByText('Try the Phone Lunk Demo')).toBeInTheDocument()
})
```

- [ ] **Step 4: Run tests and verify HTML**

```bash
npm test -- --runTestsByPath __tests__/PhoneDetector.test.tsx
npm run build
node -e "const fs=require('fs'); const html=fs.readFileSync('out/demo/index.html','utf8'); console.log((html.match(/<title[^>]*>.*?<\\/title>/)||[])[0]); console.log((html.match(/<h1[^>]*>.*?<\\/h1>/s)||[])[0]);"
```

Expected:
- test passes
- build passes
- title contains `AI Phone Detector Demo for Gyms`
- H1 contains `AI Phone Detector Demo for Gyms`

- [ ] **Step 5: Commit**

```bash
git add app/demo/page.tsx components/PhoneDetector.tsx __tests__/PhoneDetector.test.tsx
git commit -m "feat: make demo page a standalone SEO landing page"
```

---

### Task 6: Replace Waitlist Gotcha With Gym Pilot Page

**Files:**
- Modify: `app/waitlist/page.tsx`

- [ ] **Step 1: Replace waitlist page**

Replace `app/waitlist/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/waitlist')

export default function WaitlistPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-16">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="heading-xl mb-6">Bring Phone Lunk to Your Gym</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Phone Lunk is a working browser demo and a pilot concept for gyms that want a memorable,
            privacy-first way to discourage phone scrolling on equipment.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a className="btn btn-primary" href="mailto:hello@phone-lunk.app?subject=Phone%20Lunk%20gym%20pilot">
              Ask About a Pilot
            </a>
            <Link className="btn btn-secondary" href="/demo">
              Try the Demo
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          {[
            ['Gym TV Scoreboard', 'A kiosk display could show anonymous detection counts, recent catches, and a QR code for members to join.'],
            ['Owner Moderation', 'A real pilot should give staff control over what appears publicly, sensitivity settings, and instant shutdown controls.'],
            ['Privacy-First Events', 'The pilot concept is based on lightweight detection events, not uploaded camera feeds or stored face images.'],
          ].map(([title, description]) => (
            <article key={title} className="card">
              <h2 className="text-xl font-bold mb-3">{title}</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
            </article>
          ))}
        </section>

        <section className="max-w-3xl mx-auto card">
          <h2 className="heading-md mb-4">What exists today?</h2>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            The browser demo detects phones locally and shows the core interaction. The kiosk, badge,
            moderation, and live gym pilot workflow are product concepts that need a real gym partner
            before they become production features.
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            If you operate a gym and want to explore the idea, email the builder and include your gym type,
            location, and what phone-use problem you are trying to solve.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify risky old copy is gone**

```bash
rg -n "OK, this isn't real|GOTCHA|follow for more dumb things" app/waitlist/page.tsx
```

Expected: no matches.

- [ ] **Step 3: Build and inspect metadata**

```bash
npm run build
node -e "const fs=require('fs'); const html=fs.readFileSync('out/waitlist/index.html','utf8'); console.log((html.match(/<title[^>]*>.*?<\\/title>/)||[])[0]); console.log((html.match(/<h1[^>]*>.*?<\\/h1>/s)||[])[0]);"
```

Expected:
- title contains `Gym Pilot Interest`
- H1 contains `Bring Phone Lunk to Your Gym`

- [ ] **Step 4: Commit**

```bash
git add app/waitlist/page.tsx
git commit -m "feat: replace waitlist with gym pilot page"
```

---

### Task 7: Add Shared SEO Content Page Layout

**Files:**
- Create: `components/SeoContentPage.tsx`
- Create: `__tests__/SeoContentPage.test.tsx`

- [ ] **Step 1: Write the layout test**

Create `__tests__/SeoContentPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import SeoContentPage from '@/components/SeoContentPage'

describe('SeoContentPage', () => {
  it('renders title, intro, sections, and CTA links', () => {
    render(
      <SeoContentPage
        title="Sample SEO Page"
        intro="Helpful intro copy."
        sections={[
          {
            heading: 'First section',
            paragraphs: ['First paragraph.'],
            bullets: ['Useful bullet'],
          },
        ]}
        cta={{
          title: 'Try the demo',
          body: 'See it in action.',
          href: '/demo',
          label: 'Open demo',
        }}
      />
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Sample SEO Page' })).toBeInTheDocument()
    expect(screen.getByText('Helpful intro copy.')).toBeInTheDocument()
    expect(screen.getByText('Useful bullet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open demo' })).toHaveAttribute('href', '/demo')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --runTestsByPath __tests__/SeoContentPage.test.tsx
```

Expected: FAIL because component does not exist.

- [ ] **Step 3: Create the component**

Create `components/SeoContentPage.tsx`:

```tsx
import Link from 'next/link'

type ContentSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

type SeoContentPageProps = {
  title: string
  intro: string
  sections: ContentSection[]
  cta: {
    title: string
    body: string
    href: string
    label: string
  }
}

export default function SeoContentPage({ title, intro, sections, cta }: SeoContentPageProps) {
  return (
    <main className="min-h-screen px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="heading-xl mb-6">{title}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            {intro}
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="card">
              <h2 className="heading-md mb-4">{section.heading}</h2>
              <div className="space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-10 card text-center">
          <h2 className="heading-md mb-3">{cta.title}</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{cta.body}</p>
          <Link className="btn btn-primary" href={cta.href}>
            {cta.label}
          </Link>
        </aside>
      </article>
    </main>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npm test -- --runTestsByPath __tests__/SeoContentPage.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/SeoContentPage.tsx __tests__/SeoContentPage.test.tsx
git commit -m "feat: add SEO content page layout"
```

---

### Task 8: Add Privacy and Evergreen SEO Pages

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/gym-phone-policy/page.tsx`
- Create: `app/gym-equipment-hogging/page.tsx`
- Create: `app/lunk-alarm-app/page.tsx`
- Create: `app/gym-tv-kiosk/page.tsx`

- [ ] **Step 1: Add privacy page**

Create `app/privacy/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/privacy')

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Privacy and Camera Safety"
        intro="Phone Lunk is funny because it feels loud, but camera privacy has to be boringly clear."
        sections={[
          {
            heading: 'The demo runs in your browser',
            paragraphs: [
              'The current Phone Lunk demo asks for camera access so the browser can analyze frames on your device. The demo does not upload your live camera feed to Phone Lunk.',
              'Detection quality depends on lighting, angle, device performance, and model confidence. It is a prototype, not a production security system.',
            ],
          },
          {
            heading: 'What a real gym pilot would need',
            paragraphs: [
              'A gym deployment should avoid public personal media by default. The safer product shape is anonymous detection events, staff moderation, and aggregate counts.',
              'Any public screen should be controlled by the gym owner, with sensitivity settings, a moderation queue, and an instant off switch.',
            ],
            bullets: [
              'No face storage by default.',
              'No member accounts required for simple participation.',
              'Clear signage before any pilot runs in a real gym.',
              'Staff review before anything sensitive appears publicly.',
            ],
          },
        ]}
        cta={{
          title: 'Try the browser demo',
          body: 'See the interaction locally before thinking about a gym pilot.',
          href: '/demo',
          label: 'Open the demo',
        }}
      />
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Add gym phone policy page**

Create `app/gym-phone-policy/page.tsx` with metadata and `SeoContentPage`. Use this content:

```tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/gym-phone-policy')

export default function GymPhonePolicyPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Gym Phone Policy Guide and Sample Rules"
        intro="A good gym phone policy should protect member focus, privacy, and equipment flow without turning staff into hall monitors."
        sections={[
          {
            heading: 'What the policy should cover',
            paragraphs: [
              'Phones are part of modern training: members track workouts, film form checks, follow programs, and message coaches. The problem is not phone ownership; it is blocking equipment while scrolling or filming others without consent.',
              'The clearest policies separate useful phone use from behavior that affects other members.',
            ],
            bullets: [
              'Use phones for workout tracking between sets without occupying equipment longer than needed.',
              'Step away from benches, racks, and machines for long calls, texting, or scrolling.',
              'Get consent before filming anyone else.',
              'Keep tripods and filming setups out of walkways.',
            ],
          },
          {
            heading: 'Sample gym phone policy',
            paragraphs: [
              'Please keep phone use respectful and brief while using equipment. Track your workout, change music, or check your plan, then keep sets moving. If you need to text, scroll, take a call, or film multiple takes, step away from shared equipment so other members can train.',
              'Filming other members without consent is not allowed. Staff may ask members to move, pause filming, or share equipment when phone use slows down the floor.',
            ],
          },
          {
            heading: 'How Phone Lunk fits',
            paragraphs: [
              'Phone Lunk is not a replacement for a fair policy. It is a memorable demo and kiosk concept that helps gyms talk about the behavior everyone already recognizes: camping on equipment while scrolling.',
            ],
          },
        ]}
        cta={{
          title: 'See the phone detector demo',
          body: 'Try the playful AI demo behind the Phone Lunk concept.',
          href: '/demo',
          label: 'Try Phone Lunk',
        }}
      />
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Add equipment hogging page**

Create `app/gym-equipment-hogging/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/gym-equipment-hogging')

export default function GymEquipmentHoggingPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Gym Equipment Hogging: Causes and Fixes"
        intro="Equipment hogging is one of those gym problems that feels small until enough members hit the same bottleneck every week."
        sections={[
          {
            heading: 'Why equipment hogging feels so frustrating',
            paragraphs: [
              'Most gyms have a few high-demand zones: benches, squat racks, cable machines, and popular plate-loaded equipment. When one member camps there without actively training, the whole floor feels slower.',
              'The frustration is not only about time. Members can start to feel that the gym is unmanaged, unfair, or too crowded even when the real problem is equipment flow.',
            ],
          },
          {
            heading: 'How phone use makes it worse',
            paragraphs: [
              'Phones are useful for workout tracking, music, timers, coaching, and form checks. The problem starts when a quick glance turns into scrolling while someone else waits.',
              'That behavior is hard for staff to address because it can look harmless from across the room. A clear policy, visible reminders, and a little humor can make the norm easier to enforce.',
            ],
          },
          {
            heading: 'Practical ways gyms can reduce it',
            paragraphs: [
              'Gyms do not need to ban phones to improve equipment flow. The best approach is to define the behavior that causes friction and give staff a friendly script for addressing it.',
            ],
            bullets: [
              'Post simple time and sharing expectations near high-demand machines.',
              'Train staff to intervene politely before frustration escalates.',
              'Designate areas for longer calls, filming, or texting.',
              'Use humorous reminders so the rule feels social instead of punitive.',
            ],
          },
        ]}
        cta={{
          title: 'Write a clearer phone policy',
          body: 'Start with a practical policy members can understand in one read.',
          href: '/gym-phone-policy',
          label: 'Open the policy guide',
        }}
      />
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Add lunk alarm app page**

Create `app/lunk-alarm-app/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/lunk-alarm-app')

export default function LunkAlarmAppPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Lunk Alarm App Concept for Phone Use at Gyms"
        intro="Phone Lunk takes the spirit of a lunk alarm and points it at a modern gym annoyance: camping on equipment while scrolling."
        sections={[
          {
            heading: 'What is a lunk alarm app?',
            paragraphs: [
              'A lunk alarm app is a playful way to call attention to gym behavior that disrupts other members. Phone Lunk focuses on phone use around shared equipment instead of grunting, dropping weights, or classic gym stereotypes.',
              'The joke works because everyone knows the scene: someone sits on a machine, opens their phone, and the rest of the floor quietly waits.',
            ],
          },
          {
            heading: 'What Phone Lunk does today',
            paragraphs: [
              'The current app is a browser-based AI demo. It asks for camera access, runs object detection locally, and triggers an alarm-style overlay when it sees a phone.',
              'It is not a production enforcement system. It is a working prototype and a shareable product sketch for gyms that want a fun way to talk about etiquette.',
            ],
          },
          {
            heading: 'What a gym-ready version would need',
            paragraphs: [
              'A real gym version should be calmer and more controlled than the joke. It needs owner moderation, privacy controls, clear signage, and aggregate detection events instead of public personal media.',
            ],
            bullets: [
              'A gym TV kiosk with an all-clear state and session counter.',
              'A QR flow for anonymous member participation.',
              'Moderation before anything appears publicly.',
              'A privacy-first design that avoids storing face images or live camera feeds.',
            ],
          },
        ]}
        cta={{
          title: 'Try the AI detector',
          body: 'Run the browser demo and see the core interaction yourself.',
          href: '/demo',
          label: 'Open Phone Lunk',
        }}
      />
      <Footer />
    </>
  )
}
```

- [ ] **Step 5: Add gym TV kiosk page**

Create `app/gym-tv-kiosk/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoContentPage from '@/components/SeoContentPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata('/gym-tv-kiosk')

export default function GymTvKioskPage() {
  return (
    <>
      <Header />
      <SeoContentPage
        title="Gym TV Kiosk Concept for Phone Lunk Detection"
        intro="The long-term Phone Lunk idea is not a secret camera feed. It is a visible, moderated gym TV concept that turns equipment hogging into an anonymous scoreboard."
        sections={[
          {
            heading: 'The kiosk concept',
            paragraphs: [
              'A gym TV kiosk would show the gym name, an all-clear state, a QR code, and a daily count of anonymous phone-lunk detections. When a detection event arrives, the screen can flash the joke without showing identifying personal media.',
              'The kiosk is meant to create a social norm: keep sets moving, step away for long scrolling, and respect shared equipment.',
            ],
          },
          {
            heading: 'How a member would join',
            paragraphs: [
              'A member scans a QR code on the kiosk, opens a lightweight detector flow, and sends anonymous detection events to that gym room. No account should be required for the simple participation flow.',
              'A production version should make the privacy model visible before anyone joins.',
            ],
          },
          {
            heading: 'Owner controls and moderation',
            paragraphs: [
              'The gym owner needs the boring controls: moderation queue, sensitivity settings, on/off switch, staff-only admin view, and signage guidance.',
              'That control layer is what separates a funny prototype from something a real gym could responsibly test.',
            ],
          },
          {
            heading: 'Why the badge matters',
            paragraphs: [
              'A Phone Lunk Protected badge could give participating gyms a small, linkable artifact for their website. That badge is part product surface, part organic growth loop, and part reminder that the gym takes equipment flow seriously.',
            ],
          },
        ]}
        cta={{
          title: 'Interested in a pilot?',
          body: 'See the gym-owner pilot page and share what kind of gym you operate.',
          href: '/waitlist',
          label: 'View pilot details',
        }}
      />
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Run tests and build**

```bash
npm test -- --runTestsByPath __tests__/SeoContentPage.test.tsx __tests__/seo.test.ts
npm run type-check
npm run build
```

Expected: all pass.

- [ ] **Step 7: Verify generated routes**

```bash
for f in privacy gym-phone-policy gym-equipment-hogging lunk-alarm-app gym-tv-kiosk; do test -f "out/$f/index.html" && echo "ok $f"; done
```

Expected: all five print `ok`.

- [ ] **Step 8: Commit**

```bash
git add app/privacy/page.tsx app/gym-phone-policy/page.tsx app/gym-equipment-hogging/page.tsx app/lunk-alarm-app/page.tsx app/gym-tv-kiosk/page.tsx
git commit -m "feat: add SEO content and privacy pages"
```

---

### Task 9: Fix About, Footer, README, and Package Identity

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `components/Footer.tsx`
- Modify: `README.md`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Remove broken About images**

In `app/about/page.tsx`, remove image blocks referencing:

```text
/images/jeremy-watt-headshot.jpg
/images/ml-refined-cover.png
```

Keep a text-only about page with H1:

```tsx
<h1 className="text-4xl font-bold mb-4">About Phone Lunk</h1>
```

Add this intro paragraph:

```tsx
Phone Lunk is a side-project by Jeremy Watt: part AI demo, part gym etiquette joke, and part product sketch for a privacy-first gym kiosk.
```

- [ ] **Step 2: Add footer internal links**

In `components/Footer.tsx`, add an internal link row above the social links:

```tsx
<nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-6 sm:mb-0" aria-label="Footer">
  <a href="/demo">Demo</a>
  <a href="/privacy">Privacy</a>
  <a href="/gym-phone-policy">Phone Policy</a>
  <a href="/gym-tv-kiosk">Kiosk Concept</a>
</nav>
```

Use existing text colors and hover opacity styles.

- [ ] **Step 3: Replace README**

Replace the README title and opening with:

```md
# Phone Lunk

Phone Lunk is a playful AI phone detection demo for gyms. It uses browser-based object detection to spot phones on camera and explores a privacy-first kiosk concept for discouraging equipment hogging.

## What Exists Today

- Static Next.js site
- Browser-based phone detector demo
- Local camera processing in the demo
- Shareable alarm/recording workflow
- SEO pages for gym phone policies, equipment hogging, and the kiosk concept

## Development

```bash
npm install
npm run dev
npm run type-check
npm run lint
npm run test
npm run build
```
```

Keep useful script/deployment details, remove template-specific "Use This Template" language.

- [ ] **Step 4: Update package metadata**

In `package.json`, change:

```json
"name": "phone-lunk",
"description": "A playful AI phone detection demo and gym kiosk concept for reducing equipment hogging",
"keywords": [
  "gym",
  "phone-detection",
  "ai-demo",
  "fitness-technology",
  "gym-etiquette",
  "nextjs"
]
```

Run:

```bash
npm install --package-lock-only
```

Expected: `package-lock.json` reflects the package name change without reinstalling packages.

- [ ] **Step 5: Verify broken image references are gone**

```bash
rg -n "jeremy-watt-headshot|ml-refined-cover|Next.js Landing Page Template|nextjs-landing-template" app README.md package.json package-lock.json
```

Expected: no matches.

- [ ] **Step 6: Build**

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 7: Commit**

```bash
git add app/about/page.tsx components/Footer.tsx README.md package.json package-lock.json
git commit -m "chore: update project identity and footer links"
```

---

### Task 10: Fix Existing Lint Warnings and Run Full Verification

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/PhoneDetector.tsx`

- [ ] **Step 1: Fix Google Tag Manager inline script lint warning**

In `app/layout.tsx`, replace the raw GTM `<script>` in `<head>` with `next/script`:

```tsx
<Script id="google-tag-manager" strategy="afterInteractive">
  {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MKS2GNDH');`}
</Script>
```

Keep the existing noscript iframe.

- [ ] **Step 2: Fix `PhoneDetector` hook dependency warning**

In `components/PhoneDetector.tsx`, move the existing `stopRecording` callback above `startRecording`, because `startRecording` calls `stopRecording` from its interval callback. The moved callback should remain:

```tsx
const stopRecording = useCallback(() => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
    mediaRecorderRef.current.stop()
  }
  if (recordingTimerRef.current) {
    clearInterval(recordingTimerRef.current)
    recordingTimerRef.current = null
  }
  setIsRecording(false)
}, [])
```

Then change the `startRecording` dependency array from:

```tsx
}, [isCameraActive, drawRecordingFrame])
```

to:

```tsx
}, [isCameraActive, drawRecordingFrame, stopRecording])
```

Do not change `handleClosePreview`; it currently only clears the preview state and does not call `stopRecording`.

- [ ] **Step 3: Run full checks**

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

Expected:
- lint passes with 0 warnings
- type-check passes
- Jest passes
- build passes

- [ ] **Step 4: Verify metadata across built pages**

```bash
node - <<'NODE'
const fs = require('fs')
const pages = ['index', 'demo', 'waitlist', 'privacy', 'gym-phone-policy', 'gym-equipment-hogging', 'lunk-alarm-app', 'gym-tv-kiosk', 'about']
for (const page of pages) {
  const file = page === 'index' ? 'out/index.html' : `out/${page}/index.html`
  const html = fs.readFileSync(file, 'utf8')
  const title = (html.match(/<title[^>]*>.*?<\\/title>/) || ['NO TITLE'])[0]
  const desc = (html.match(/<meta name="description"[^>]*>/) || ['NO DESC'])[0]
  const canonical = (html.match(/<link rel="canonical"[^>]*>/) || ['NO CANONICAL'])[0]
  console.log(`\\n## ${page}`)
  console.log(title)
  console.log(desc)
  console.log(canonical)
}
NODE
```

Expected: every page has unique title/description and a `https://www.phone-lunk.app/...` canonical.

- [ ] **Step 5: Run Playwright smoke tests**

```bash
npm run test:e2e -- --project=chromium tests/home.spec.ts
```

Expected: home smoke tests pass. If camera-dependent tests are skipped in CI by design, do not change that behavior in this task.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx components/PhoneDetector.tsx
git commit -m "chore: fix lint warnings before SEO launch"
```

---

### Task 11: Final SEO QA and Launch Notes

**Files:**
- Modify: `docs/superpowers/plans/2026-05-31-phone-lunk-seo-growth.md` only if recording actual verification notes in the plan.

- [ ] **Step 1: Run full verification suite**

```bash
npm run lint
npm run type-check
npm run test
npm run build
npm run test:e2e -- --project=chromium tests/home.spec.ts
```

Expected: all pass.

- [ ] **Step 2: Check generated sitemap and robots**

```bash
sed -n '1,160p' out/sitemap.xml
sed -n '1,80p' out/robots.txt
```

Expected:
- sitemap includes `/`, `/demo/`, `/waitlist/`, `/privacy/`, `/gym-phone-policy/`, `/gym-equipment-hogging/`, `/lunk-alarm-app/`, `/gym-tv-kiosk/`, and `/about/`
- robots references `https://www.phone-lunk.app/sitemap.xml`

- [ ] **Step 3: Check risky claim cleanup**

```bash
rg -n "No false positives|Planet Fitness Approved|corporate-tested|Enterprise phone detection|OK, this isn't real|GOTCHA" app components site.config.mjs README.md
```

Expected: no matches.

- [ ] **Step 4: Check generated static pages for missing images**

```bash
node - <<'NODE'
const fs = require('fs')
const path = require('path')
const htmlFiles = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(p)
  }
}
walk('out')
const missing = []
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = match[1]
    if (src.startsWith('/') && !fs.existsSync(path.join('out', src))) {
      missing.push(`${file}: ${src}`)
    }
  }
}
console.log(missing.length ? missing.join('\\n') : 'no missing local images')
NODE
```

Expected: `no missing local images`.

- [ ] **Step 5: Manual browser QA**

Run:

```bash
npm run dev
```

Open:
- `http://localhost:3000/`
- `http://localhost:3000/demo`
- `http://localhost:3000/waitlist`
- `http://localhost:3000/privacy`
- `http://localhost:3000/gym-phone-policy`
- `http://localhost:3000/gym-equipment-hogging`
- `http://localhost:3000/lunk-alarm-app`
- `http://localhost:3000/gym-tv-kiosk`

Verify:
- no obvious mobile overflow
- nav links work
- footer links work
- homepage still feels like Phone Lunk
- demo page explains camera privacy before interaction
- pilot page is credible and does not overpromise

- [ ] **Step 6: Commit final QA notes if any files changed**

If no files changed, do not commit. If documentation changed:

```bash
git add docs/superpowers/plans/2026-05-31-phone-lunk-seo-growth.md
git commit -m "docs: record SEO launch verification"
```

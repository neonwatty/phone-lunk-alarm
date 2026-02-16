/**
 * Site Configuration
 *
 * This file contains all customizable settings for your landing page.
 * Update these values to personalize your site.
 */

interface SiteInfo {
  name: string
  tagline: string
  description: string
  url: string
  keywords: string[]
}

interface AuthorInfo {
  name: string
  role: string
  bio: string
  email: string
}

interface SocialLinks {
  github: string | null
  twitter: string | null
  linkedin: string | null
  email: string | null
  blog: string | null
  reddit: string | null
}

interface NewsletterConfig {
  enabled: boolean
  embedUrl: string
  title: string
  description: string
}

interface NavItem {
  name: string
  href: string
}

interface CTA {
  text: string
  href: string
}

interface HeroConfig {
  headline: string
  subheadline: string
  primaryCTA: CTA
  secondaryCTA: CTA | null
  image: string | null
}

interface HowItWorksStep {
  number: number
  emoji: string
  title: string
  description: string
}

interface HowItWorksConfig {
  sectionTitle: string
  sectionSubtitle: string
  steps: HowItWorksStep[]
}

interface Feature {
  title: string
  description: string
  icon: string
}

interface CTAConfig {
  headline: string
  description: string
  buttonText: string
  buttonHref: string
}

interface OpenGraphImage {
  url: string
  width: number
  height: number
  alt: string
}

interface SEOConfig {
  titleTemplate: string
  defaultTitle: string
  description: string
  openGraph: {
    type: string
    locale: string
    images: OpenGraphImage[]
  }
  twitter: {
    handle: string
    site: string
    cardType: string
  }
}

interface AnalyticsConfig {
  googleAnalyticsId: string | null
  vercelAnalytics: boolean
  vercelSpeedInsights: boolean
}

interface ThemeConfig {
  primaryColor: string
  accentColor: string
}

interface SiteConfig {
  site: SiteInfo
  author: AuthorInfo
  social: SocialLinks
  newsletter: NewsletterConfig
  navigation: NavItem[]
  hero: HeroConfig
  howItWorks: HowItWorksConfig
  features: Feature[]
  cta: CTAConfig
  seo: SEOConfig
  analytics: AnalyticsConfig
  theme: ThemeConfig
}

const siteConfig: SiteConfig = {
  // Basic site information
  site: {
    name: 'Phone Lunk',
    tagline: 'AI-Powered Phone Detection for Gyms',
    description:
      'Enterprise phone detection solution that identifies equipment hogs, reduces wait times, and improves member retention. The complete AI platform for gym equipment utilization.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://phone-lunk.app',
    keywords: [
      'gym management software',
      'phone detection',
      'ai',
      'fitness technology',
      'equipment monitoring',
      'member retention',
      'gym saas',
    ],
  },

  // Author/company information
  author: {
    name: 'neonwatty',
    role: 'Product Builder',
    bio: 'Building innovative tools and products.',
    email: 'hello@example.com',
  },

  // Social media links (set to null to hide)
  social: {
    github: null,
    twitter: 'https://x.com/neonwatty',
    linkedin: null,
    email: null,
    blog: 'https://neonwatty.com/',
    reddit: null,
  },

  // Newsletter configuration (Beehiiv embed)
  newsletter: {
    enabled: false,
    embedUrl: '',
    title: '',
    description: '',
  },

  // Navigation menu items
  navigation: [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'See Demo', href: '#demo' },
    { name: 'Pricing', href: '/waitlist?utm_source=pricing' },
    { name: 'Request Demo', href: '/waitlist?utm_source=waitlist' },
  ],

  // Hero section configuration
  hero: {
    headline: 'Put Phone Lunks On Blast',
    subheadline:
      'Phone lunks kill the vibe of your gym, piss off members, and slow throughput.\nWe catch them automatically and put them on blast with AI-powered justice.',
    primaryCTA: {
      text: 'See It In Action',
      href: '#demo',
    },
    secondaryCTA: {
      text: 'How It Works',
      href: '#how-it-works',
    },
    image: null,
  },

  // How It Works section
  howItWorks: {
    sectionTitle: 'How It Works',
    sectionSubtitle: 'Enterprise-grade phone detection in three simple steps',
    steps: [
      {
        number: 1,
        emoji: '\u{1F4BB}',
        title: 'Zero Hardware Required',
        description: 'Plug-n-play with your existing cameras.',
      },
      {
        number: 2,
        emoji: '\u{1F9E0}',
        title: 'Real-Time Detection',
        description:
          'AI never blinks. Finds doom-scrolling hogs wherever they lurk.',
      },
      {
        number: 3,
        emoji: '\u{1F6A8}',
        title: 'Automated Enforcement',
        description:
          'Sinners shamed publicly. Let the lunk alarm ring.',
      },
    ],
  },

  // Features section
  features: [
    {
      title: 'AI-Powered Detection',
      description:
        'Real-time object detection powered by [TensorFlow.js]. Identifies phone usage on equipment with industry-leading accuracy. No false positives.',
      icon: 'camera',
    },
    {
      title: 'Instant Staff Alerts',
      description:
        'Push notifications to your team the moment a phone lunk is detected. [Real-time dashboards] show hotspots and repeat offenders.',
      icon: 'bell-alert',
    },
    {
      title: 'Boost Equipment ROI',
      description:
        'Reduce [equipment hoarding] by up to 40%. Free up benches and machines from doom scrollers. Increase member throughput without buying more equipment.',
      icon: 'shield-check',
    },
    {
      title: 'Proven Technology',
      description:
        'Built on [COCO-SSD model] trained on millions of images. The same AI that powers self-driving cars, now protecting your squat racks.',
      icon: 'light-bulb',
    },
    {
      title: 'Member Retention',
      description:
        'Members stay longer when they can actually [use the equipment]. Drive NPS scores up by eliminating the #1 gym complaint.',
      icon: 'check-badge',
    },
    {
      title: 'Planet Fitness Approved\u2122',
      description:
        'Inspired by the legendary [lunk alarm]. Franchise-ready, corporate-tested. Scales from boutique studios to 24-hour chains.',
      icon: 'fire',
    },
  ],

  // Call-to-action section
  cta: {
    headline: 'Ready to Make Your Gym Phone Lunk Free?',
    description:
      'See the technology in action. Test our AI detection with your own phone and experience real-time alerts.',
    buttonText: 'See the Demo',
    buttonHref: '#demo',
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | Phone Lunk',
    defaultTitle: 'Phone Lunk - AI-Powered Phone Detection for Gyms',
    description:
      'Enterprise AI solution that identifies equipment hogs, reduces wait times, and improves member retention. Smart phone detection for modern gym management.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Phone Lunk - AI-powered phone detection for gyms',
        },
      ],
    },
    twitter: {
      handle: '@neonwatty',
      site: '@neonwatty',
      cardType: 'summary_large_image',
    },
  },

  // Analytics (optional - set to null to disable)
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || null,
    vercelAnalytics: true,
    vercelSpeedInsights: true,
  },

  // Theme colors (CSS custom properties)
  theme: {
    primaryColor: '#A4278D',
    accentColor: '#F9F72E',
  },
}

export default siteConfig

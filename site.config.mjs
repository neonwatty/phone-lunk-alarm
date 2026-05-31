/**
 * Site Configuration
 *
 * This file contains all customizable settings for your landing page.
 * Update these values to personalize your site.
 */

const siteConfig = {
  // Basic site information
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
    { name: 'Demo', href: '/demo' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Features', href: '/#features' },
    { name: 'Gym Pilot', href: '/waitlist' },
  ],

  // Hero section configuration
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
    // Optional: Add image path like '/images/hero-image.png'
    image: null,
  },

  // How It Works section
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

  // Features section
  features: [
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
  ],

  // Call-to-action section
  cta: {
    headline: 'Want to Test the Gym Pilot Concept?',
    description: 'Try the browser demo, then see how a privacy-first kiosk pilot could make equipment hogging visible without storing personal camera feeds.',
    buttonText: 'Explore the Gym Pilot',
    buttonHref: '/waitlist',
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | Phone Lunk',
    defaultTitle: 'Phone Lunk - AI Phone Detection Demo for Gyms',
    description: 'Try a playful AI phone detector demo for gyms, then see how a privacy-first kiosk concept could help reduce equipment hogging.',
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
    // Primary brand color (Planet Fitness purple)
    primaryColor: '#A4278D',
    // Accent color for highlights (Planet Fitness yellow)
    accentColor: '#F9F72E',
  },
}

export default siteConfig

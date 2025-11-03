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
    tagline: 'Fuck your phone',
    description: 'Phone Lunk detects idiots doom scrolling at the gym and puts them on blast.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://phone-lunk.app',
    keywords: ['gym', 'phone detection', 'ai', 'fitness', 'lunk alarm'],
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
    { name: 'About', href: '/waitlist?utm_source=waitlist' },
    { name: 'Features', href: '#features' },
    { name: 'Try it Now', href: '#demo' },
    { name: 'Investors', href: '/waitlist?utm_source=waitlist' },
    { name: 'Join the Waitlist', href: '/waitlist?utm_source=waitlist' },
  ],

  // Hero section configuration
  hero: {
    headline: 'Fuck Your Phone',
    subheadline: 'Phone Lunk detects idiots doom scrolling at the gym and puts them on blast.',
    primaryCTA: {
      text: 'Try the Demo',
      href: '#demo',
    },
    secondaryCTA: {
      text: 'How It Works',
      href: '#features',
    },
    // Optional: Add image path like '/images/hero-image.png'
    image: null,
  },

  // Features section
  features: [
    {
      title: 'AI Snitch Mode',
      description: 'Real-time object detection powered by [TensorFlow.js]. Catches phones in the wild with scary accuracy.',
      icon: 'camera', // heroicons name
    },
    {
      title: 'Instant Shame',
      description: 'Visual alarms and warning boxes appear the moment someone pulls out their phone. [No mercy].',
      icon: 'bell-alert',
    },
    {
      title: 'Protect Gym Culture',
      description: 'Stop [phone lunks] from camping on equipment. Free up benches and machines from doom scrollers hogging what you need.',
      icon: 'shield-check',
    },
    {
      title: 'Actually Possible',
      description: 'You know we could [actually build this], right?',
      icon: 'light-bulb',
    },
    {
      title: 'Actually Works',
      description: 'Built on [COCO-SSD model] trained on millions of images. Detects phones with impressive accuracy.',
      icon: 'check-badge',
    },
    {
      title: 'Planet Fitness Vibes',
      description: 'Inspired by the legendary [lunk alarm]. Same energy, different target. Red lights and all.',
      icon: 'fire',
    },
  ],

  // Call-to-action section
  cta: {
    headline: 'Ready to Keep Your Gym Real?',
    description: 'Test the phone detection yourself. Pull out your phone on camera and watch what happens.',
    buttonText: 'Try the Detector',
    buttonHref: '#demo',
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | Phone Lunk',
    defaultTitle: 'Phone Lunk - Fuck Your Phone',
    description: 'Phone Lunk detects idiots doom scrolling at the gym and puts them on blast.',
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

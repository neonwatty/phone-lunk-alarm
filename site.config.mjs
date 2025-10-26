/**
 * Site Configuration
 *
 * This file contains all customizable settings for your landing page.
 * Update these values to personalize your site.
 */

const siteConfig = {
  // Basic site information
  site: {
    name: 'Phone Lunk Alarm',
    tagline: 'Stop the scroll, hit your goals',
    description: 'AI-powered phone detection for gyms. Because scrolling between sets isn\'t a workout.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io/phone-lunk-alarm',
    keywords: ['gym', 'phone detection', 'ai', 'fitness', 'lunk alarm'],
  },

  // Author/company information
  author: {
    name: 'Your Name',
    role: 'Product Builder',
    bio: 'Building innovative tools and products.',
    email: 'hello@example.com',
  },

  // Social media links (set to null to hide)
  social: {
    github: 'https://github.com/neonwatty',
    twitter: 'https://x.com/neonwatty',
    linkedin: null,
    email: null,
    blog: 'https://neonwatty.com/',
    reddit: 'https://www.reddit.com/user/neonwatty/',
  },

  // Newsletter configuration (Beehiiv embed)
  newsletter: {
    enabled: true,
    embedUrl: 'https://subscribe-forms.beehiiv.com/a32a2710-173d-423e-b754-3a4cd3c25cc9',
    title: 'Stay Updated on Phone Lunk Prevention',
    description: 'Get gym tech updates and new detection features delivered straight to your inbox.',
  },

  // Navigation menu items
  navigation: [
    { name: 'About', href: '/about' },
    { name: 'Newsletter', href: '/newsletter' },
  ],

  // Hero section configuration
  hero: {
    headline: 'Phones Down. Gains Up.',
    subheadline: 'We see you scrolling between sets. AI-powered detection that calls out phone lunks in real-time. Time to keep your gym focused.',
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
      description: 'Real-time object detection powered by TensorFlow.js. Catches phones in the wild with scary accuracy.',
      icon: 'camera', // heroicons name
    },
    {
      title: 'Instant Shame',
      description: 'Visual alarms and warning boxes appear the moment someone pulls out their phone. No mercy.',
      icon: 'bell-alert',
    },
    {
      title: 'Protect Gym Culture',
      description: 'Keep benches free and rest times honest. Because your gym deserves better than TikTok between sets.',
      icon: 'shield-check',
    },
    {
      title: 'Browser-Based',
      description: 'No app install needed. Works right in the browser with webcam access. Try it yourself.',
      icon: 'globe-alt',
    },
    {
      title: 'Actually Works',
      description: 'Built on COCO-SSD model trained on millions of images. Detects phones with impressive accuracy.',
      icon: 'check-badge',
    },
    {
      title: 'Planet Fitness Vibes',
      description: 'Inspired by the legendary lunk alarm. Same energy, different target. Red lights and all.',
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
    titleTemplate: '%s | Phone Lunk Alarm',
    defaultTitle: 'Phone Lunk Alarm - Stop the Scroll, Hit Your Goals',
    description: 'AI-powered phone detection for gyms. Because scrolling between sets isn\'t a workout.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Product Name',
        },
      ],
    },
    twitter: {
      handle: '@yourusername',
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
    // Primary brand color (indigo/purple by default)
    primaryColor: '#6366F1',
    // Accent color for highlights
    accentColor: '#8B5CF6',
  },
}

export default siteConfig

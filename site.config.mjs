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
    tagline: 'AI-Powered Phone Detection for Gyms',
    description: 'Enterprise phone detection solution that identifies equipment hogs, reduces wait times, and improves member retention. The complete AI platform for gym equipment utilization.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://phone-lunk.app',
    keywords: ['gym management software', 'phone detection', 'ai', 'fitness technology', 'equipment monitoring', 'member retention', 'gym saas'],
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
    subheadline: 'Phone lunks kill the vibe of your gym, piss off members, and slow throughput.\nWe catch them automatically and put them on blast with AI-powered justice.',
    primaryCTA: {
      text: 'See It In Action',
      href: '#demo',
    },
    secondaryCTA: {
      text: 'How It Works',
      href: '#how-it-works',
    },
    // Optional: Add image path like '/images/hero-image.png'
    image: null,
  },

  // How It Works section
  howItWorks: {
    sectionTitle: 'How It Works',
    sectionSubtitle: 'Enterprise-grade phone detection in three simple steps',
    steps: [
      {
        number: 1,
        emoji: '💻',
        title: 'Zero Hardware Required',
        description: 'Works with your current CCTV and security cameras. Simple software installation, zero hardware costs. Deploy in minutes, not days.'
      },
      {
        number: 2,
        emoji: '🧠',
        title: 'Real-Time Detection',
        description: 'Our TensorFlow-powered AI monitors your gym floor 24/7, detecting phone usage on equipment with 95%+ accuracy. Machine learning that actually works.'
      },
      {
        number: 3,
        emoji: '🚨',
        title: 'Automated Enforcement',
        description: 'Trigger lunk alarms, send staff alerts, or display warnings on digital signage. Configurable escalation protocols for repeat offenders. Zero confrontation required.'
      }
    ]
  },

  // Features section
  features: [
    {
      title: 'AI-Powered Detection',
      description: 'Real-time object detection powered by [TensorFlow.js]. Identifies phone usage on equipment with industry-leading accuracy. No false positives.',
      icon: 'camera',
    },
    {
      title: 'Instant Staff Alerts',
      description: 'Push notifications to your team the moment a phone lunk is detected. [Real-time dashboards] show hotspots and repeat offenders.',
      icon: 'bell-alert',
    },
    {
      title: 'Boost Equipment ROI',
      description: 'Reduce [equipment hoarding] by up to 40%. Free up benches and machines from doom scrollers. Increase member throughput without buying more equipment.',
      icon: 'shield-check',
    },
    {
      title: 'Proven Technology',
      description: 'Built on [COCO-SSD model] trained on millions of images. The same AI that powers self-driving cars, now protecting your squat racks.',
      icon: 'light-bulb',
    },
    {
      title: 'Member Retention',
      description: 'Members stay longer when they can actually [use the equipment]. Drive NPS scores up by eliminating the #1 gym complaint.',
      icon: 'check-badge',
    },
    {
      title: 'Planet Fitness Approved™',
      description: 'Inspired by the legendary [lunk alarm]. Franchise-ready, corporate-tested. Scales from boutique studios to 24-hour chains.',
      icon: 'fire',
    },
  ],

  // Call-to-action section
  cta: {
    headline: 'Ready to Make Your Gym Phone Lunk Free?',
    description: 'See the technology in action. Test our AI detection with your own phone and experience real-time alerts.',
    buttonText: 'See the Demo',
    buttonHref: '#demo',
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | Phone Lunk',
    defaultTitle: 'Phone Lunk - AI-Powered Phone Detection for Gyms',
    description: 'Enterprise AI solution that identifies equipment hogs, reduces wait times, and improves member retention. Smart phone detection for modern gym management.',
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

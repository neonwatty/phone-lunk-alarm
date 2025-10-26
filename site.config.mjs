/**
 * Site Configuration
 *
 * This file contains all customizable settings for your landing page.
 * Update these values to personalize your site.
 */

const siteConfig = {
  // Basic site information
  site: {
    name: 'Product Name',
    tagline: 'Build something amazing',
    description: 'A modern, performant landing page built with Next.js',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io/your-repo',
    keywords: ['product', 'nextjs', 'landing-page', 'saas'],
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
    title: 'Subscribe to Newsletter',
    description: 'Get the latest updates delivered to your inbox.',
  },

  // Navigation menu items
  navigation: [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '/about' },
    { name: 'Docs', href: '#docs' },
  ],

  // Hero section configuration
  hero: {
    headline: 'Build Your Next Big Idea',
    subheadline: 'A powerful, easy-to-use platform that helps you ship faster and grow bigger.',
    primaryCTA: {
      text: 'Get Started',
      href: '#features',
    },
    secondaryCTA: {
      text: 'Learn More',
      href: '/about',
    },
    // Optional: Add image path like '/images/hero-image.png'
    image: null,
  },

  // Features section
  features: [
    {
      title: 'Lightning Fast',
      description: 'Optimized for performance with static site generation and modern best practices.',
      icon: 'bolt', // heroicons name
    },
    {
      title: 'Fully Customizable',
      description: 'Every aspect of your site can be customized through simple configuration.',
      icon: 'cog-6-tooth',
    },
    {
      title: 'Deploy Anywhere',
      description: 'Static export makes it easy to deploy to GitHub Pages, Vercel, Netlify, or any static host.',
      icon: 'rocket-launch',
    },
    {
      title: 'Dark Mode',
      description: 'Beautiful light and dark themes that automatically adapt to user preferences.',
      icon: 'moon',
    },
    {
      title: 'TypeScript',
      description: 'Built with TypeScript for better developer experience and type safety.',
      icon: 'code-bracket',
    },
    {
      title: 'SEO Optimized',
      description: 'Built-in SEO best practices with meta tags, Open Graph, and Twitter Cards.',
      icon: 'magnifying-glass',
    },
  ],

  // Call-to-action section
  cta: {
    headline: 'Ready to Get Started?',
    description: 'Join thousands of developers building amazing products.',
    buttonText: 'Start Building',
    buttonHref: '#',
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | Product Name',
    defaultTitle: 'Product Name - Build something amazing',
    description: 'A modern, performant landing page built with Next.js',
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

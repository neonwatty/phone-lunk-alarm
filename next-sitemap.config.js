/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.phone-lunk.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Only needed for 50k+ URLs
  outDir: './out', // Must match your static export output directory

  // Exclude patterns
  exclude: [
    '/404/',
    '/404.html',
    '/api/*',
  ],

  // robots.txt options
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },

  // Transform function to customize URLs with proper priorities
  transform: async (config, path) => {
    // Custom priority logic based on page importance
    let priority = 0.7 // Default priority
    let changefreq = 'weekly' // Default change frequency

    // Homepage gets highest priority
    if (path === '/' || path === '') {
      priority = 1.0
      changefreq = 'daily'
    }

    // Important pages get high priority (match both with and without trailing slash)
    if (path === '/waitlist/' || path === '/waitlist') {
      priority = 0.9
      changefreq = 'daily'
    }

    if (path === '/demo/' || path === '/demo') {
      priority = 0.9
      changefreq = 'weekly'
    }

    if (path === '/about/' || path === '/about') {
      priority = 0.8
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

    // Return the transformed URL object
    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },

  // Additional paths to include (if needed for future expansion)
  additionalPaths: async (config) => {
    const result = []

    // Add any additional static pages or routes here if needed in the future
    // Example:
    // result.push(await config.transform(config, '/special-page'))

    return result
  },
}

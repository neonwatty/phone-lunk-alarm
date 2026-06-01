#!/usr/bin/env node

/**
 * Post-Deployment Test Script
 * Tests all SEO assets and metadata after deployment
 */

import https from 'https';
import http from 'http';

const SITE_URL = (
  process.env.DEPLOYMENT_TEST_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.phone-lunk.app'
).replace(/\/$/, '');
const CANONICAL_SITE_URL = (
  process.env.DEPLOYMENT_TEST_CANONICAL_URL ||
  'https://www.phone-lunk.app'
).replace(/\/$/, '');
const TIMEOUT = 10000; // 10 seconds
const EXPECTED_SITEMAP_PATHS = [
  '/',
  '/demo/',
  '/waitlist/',
  '/about/',
  '/privacy/',
  '/gym-phone-policy/',
  '/phone-use-at-gym/',
  '/gym-equipment-hogging/',
  '/lunk-alarm-app/',
  '/gym-tv-kiosk/',
];

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results
let passed = 0;
let failed = 0;
let warnings = 0;

console.log(`${colors.cyan}🧪 Phone Lunk - Post-Deployment Test Suite${colors.reset}\n`);
console.log(`Testing: ${colors.blue}${SITE_URL}${colors.reset}\n`);

/**
 * Fetch URL and return status + headers
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Test a single image
 */
async function testImage(name, path, expectedType) {
  try {
    const url = `${SITE_URL}${path}`;
    const result = await fetchUrl(url);

    if (result.status === 200) {
      const contentType = result.headers['content-type'] || '';

      if (expectedType && !contentType.includes(expectedType)) {
        console.log(`${colors.yellow}⚠${colors.reset}  ${name} - Wrong content-type: ${contentType}`);
        warnings++;
      } else {
        const size = result.data.length;
        const sizeKB = (size / 1024).toFixed(2);
        console.log(`${colors.green}✓${colors.reset}  ${name} - ${sizeKB} KB`);
        passed++;
      }
    } else {
      console.log(`${colors.red}✗${colors.reset}  ${name} - Status ${result.status}`);
      failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset}  ${name} - ${error.message}`);
    failed++;
  }
}

/**
 * Test HTML page for meta tags
 */
async function testMetaTags() {
  console.log(`\n${colors.cyan}📋 Testing Meta Tags...${colors.reset}\n`);

  try {
    const result = await fetchUrl(SITE_URL);
    const html = result.data;

    const tests = [
      { name: 'OG Image tag', pattern: /<meta[^>]*property="og:image"[^>]*content="https:\/\/www\.phone-lunk\.app\/images\/og-image\.jpg"/ },
      { name: 'OG Image Alt text', pattern: /<meta[^>]*property="og:image:alt"[^>]*content="[^"]*Phone Lunk/ },
      { name: 'Twitter Card', pattern: /<meta[^>]*name="twitter:card"[^>]*content="summary_large_image"/ },
      { name: 'Twitter Handle', pattern: /<meta[^>]*name="twitter:creator"[^>]*content="@neonwatty"/ },
      { name: 'Twitter Site', pattern: /<meta[^>]*name="twitter:site"[^>]*content="@neonwatty"/ },
      { name: 'Theme Color', pattern: /<meta[^>]*name="theme-color"[^>]*content="#A4278D"/ },
      { name: 'Apple Touch Icon', pattern: /<link[^>]*rel="apple-touch-icon"[^>]*href="\/images\/apple-touch-icon/ },
      { name: 'Manifest Link', pattern: /<link[^>]*rel="manifest"[^>]*href="\/manifest\.json"/ },
    ];

    for (const test of tests) {
      if (test.pattern.test(html)) {
        console.log(`${colors.green}✓${colors.reset}  ${test.name}`);
        passed++;
      } else {
        console.log(`${colors.red}✗${colors.reset}  ${test.name} - Not found or incorrect`);
        failed++;
      }
    }

    // Check for old Twitter handle
    if (html.includes('@yourusername')) {
      console.log(`${colors.red}✗${colors.reset}  Found old Twitter handle (@yourusername)`);
      failed++;
    } else {
      console.log(`${colors.green}✓${colors.reset}  No old Twitter handle found`);
      passed++;
    }

  } catch (error) {
    console.log(`${colors.red}✗${colors.reset}  Failed to fetch homepage: ${error.message}`);
    failed++;
  }
}

/**
 * Test manifest.json
 */
async function testManifest() {
  console.log(`\n${colors.cyan}📱 Testing Manifest...${colors.reset}\n`);

  try {
    const result = await fetchUrl(`${SITE_URL}/manifest.json`);

    if (result.status === 200) {
      const manifest = JSON.parse(result.data);

      const tests = [
        { name: 'App Name', check: () => manifest.name === 'Phone Lunk - AI Phone Detection Demo for Gyms' },
        { name: 'Short Name', check: () => manifest.short_name === 'Phone Lunk' },
        { name: 'Theme Color', check: () => manifest.theme_color === '#A4278D' },
        { name: 'Background Color', check: () => manifest.background_color === '#111827' },
        { name: 'Relative Start URL', check: () => manifest.start_url === '.' },
        { name: 'Has Icons', check: () => manifest.icons && manifest.icons.length >= 6 },
        { name: 'Has 192x192 icon', check: () => manifest.icons.some(i => i.sizes === '192x192') },
        { name: 'Has 512x512 icon', check: () => manifest.icons.some(i => i.sizes === '512x512') },
        { name: 'Has maskable icons', check: () => manifest.icons.some(i => i.purpose === 'maskable') },
        { name: 'Icons are basePath-safe', check: () => manifest.icons.every(i => !i.src.startsWith('/')) },
      ];

      for (const test of tests) {
        if (test.check()) {
          console.log(`${colors.green}✓${colors.reset}  ${test.name}`);
          passed++;
        } else {
          console.log(`${colors.red}✗${colors.reset}  ${test.name}`);
          failed++;
        }
      }
    } else {
      console.log(`${colors.red}✗${colors.reset}  Manifest not found (${result.status})`);
      failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset}  Manifest error: ${error.message}`);
    failed++;
  }
}

/**
 * Test sitemap and robots.txt
 */
async function testSEOFiles() {
  console.log(`\n${colors.cyan}🗺️  Testing SEO Files...${colors.reset}\n`);

  try {
    // Test sitemap.xml
    const sitemapResult = await fetchUrl(`${SITE_URL}/sitemap.xml`);
    if (sitemapResult.status === 200 && sitemapResult.data.includes('<?xml')) {
      console.log(`${colors.green}✓${colors.reset}  sitemap.xml exists and is valid XML`);

      const missingPages = EXPECTED_SITEMAP_PATHS.filter((path) => {
        const expectedUrl = path === '/' ? `${CANONICAL_SITE_URL}/` : `${CANONICAL_SITE_URL}${path}`;
        return !sitemapResult.data.includes(`<loc>${expectedUrl}</loc>`);
      });

      if (missingPages.length === 0) {
        console.log(`${colors.green}✓${colors.reset}  All pages in sitemap`);
        passed += 2;
      } else {
        console.log(`${colors.red}✗${colors.reset}  Missing pages in sitemap: ${missingPages.join(', ')}`);
        passed++;
        failed++;
      }
    } else {
      console.log(`${colors.red}✗${colors.reset}  sitemap.xml not found or invalid`);
      failed++;
    }

    // Test robots.txt
    const robotsResult = await fetchUrl(`${SITE_URL}/robots.txt`);
    if (robotsResult.status === 200) {
      const hasCorrectSitemap = robotsResult.data.includes(`Sitemap: ${CANONICAL_SITE_URL}/sitemap.xml`);
      if (hasCorrectSitemap) {
        console.log(`${colors.green}✓${colors.reset}  robots.txt has correct sitemap URL`);
        passed++;
      } else {
        console.log(`${colors.red}✗${colors.reset}  robots.txt sitemap URL incorrect`);
        failed++;
      }
    } else {
      console.log(`${colors.red}✗${colors.reset}  robots.txt not found`);
      failed++;
    }

  } catch (error) {
    console.log(`${colors.red}✗${colors.reset}  SEO files error: ${error.message}`);
    failed++;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  // Test images
  console.log(`${colors.cyan}🖼️  Testing Images...${colors.reset}\n`);

  const imageTests = [
    ['OG Image', '/images/og-image.jpg', 'image/jpeg'],
    ['Twitter Card', '/images/twitter-card.jpg', 'image/jpeg'],
    ['Favicon ICO', '/favicon.ico', 'image/'],
    ['Favicon 16x16', '/favicon-16x16.png', 'image/png'],
    ['Favicon 32x32', '/favicon-32x32.png', 'image/png'],
    ['Favicon 96x96', '/favicon-96x96.png', 'image/png'],
    ['Apple Touch Icon', '/images/apple-touch-icon.png', 'image/png'],
    ['Apple Touch 152', '/images/apple-touch-icon-152x152.png', 'image/png'],
    ['Apple Touch 167', '/images/apple-touch-icon-167x167.png', 'image/png'],
    ['PWA Icon 192', '/images/icon-192x192.png', 'image/png'],
    ['PWA Icon 512', '/images/icon-512x512.png', 'image/png'],
    ['Maskable 192', '/images/icon-maskable-192x192.png', 'image/png'],
    ['Maskable 512', '/images/icon-maskable-512x512.png', 'image/png'],
  ];

  for (const [name, path, type] of imageTests) {
    await testImage(name, path, type);
  }

  // Test meta tags
  await testMetaTags();

  // Test manifest
  await testManifest();

  // Test SEO files
  await testSEOFiles();

  // Summary
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  console.log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  if (warnings > 0) {
    console.log(`${colors.yellow}⚠ Warnings: ${warnings}${colors.reset}`);
  }
  if (failed > 0) {
    console.log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  }
  console.log();

  if (failed === 0) {
    console.log(`${colors.green}🎉 All tests passed!${colors.reset}\n`);
    console.log(`Next steps:`);
    console.log(`  • Test social sharing: https://www.opengraph.xyz/?url=${SITE_URL}`);
    console.log(`  • Test Twitter card: https://cards-dev.twitter.com/validator`);
    console.log(`  • Test PWA: Chrome DevTools > Application > Manifest`);
    console.log();
  } else {
    console.log(`${colors.red}❌ Some tests failed. Please review the errors above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.join(projectRoot, 'public', 'screenshots');

// Ensure screenshots directory exists
await fs.mkdir(screenshotsDir, { recursive: true });

console.log('📸 Phone Lunk Screenshot Capture Starting...\n');
console.log('🌐 Make sure dev server is running at http://localhost:3000\n');

// Launch browser
const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2, // Retina quality
  }
});

const page = await browser.newPage();

try {
  // Navigate to the site
  console.log('🔄 Loading page...');
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Wait a bit for animations to settle
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('✅ Page loaded successfully\n');

  // ==========================================
  // 1. HERO SECTION
  // ==========================================
  console.log('📸 Capturing Hero Section...');

  await page.setViewport({ width: 1200, height: 1400, deviceScaleFactor: 2 });

  const heroElement = await page.$('section');
  if (heroElement) {
    await heroElement.screenshot({
      path: path.join(screenshotsDir, 'hero.png'),
      type: 'png'
    });
    console.log('✅ Hero section saved: hero.png');
  }

  // ==========================================
  // 2. DEFINITION BOX (SQUARE CROP)
  // ==========================================
  console.log('📸 Capturing Definition Box...');

  // Find the definition box by its distinctive yellow background
  const definitionBox = await page.evaluate(() => {
    // Look for the div with yellow background containing the definition
    const elements = Array.from(document.querySelectorAll('div'));
    const defBox = elements.find(el => {
      const bg = window.getComputedStyle(el).backgroundColor;
      const text = el.textContent || '';
      return (bg.includes('249, 247, 46') || bg.includes('#F9F72E')) &&
             text.includes('Phone Lunk');
    });

    if (defBox) {
      const rect = defBox.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height
      };
    }
    return null;
  });

  if (definitionBox) {
    await page.screenshot({
      path: path.join(screenshotsDir, 'definition-box.png'),
      type: 'png',
      clip: {
        x: definitionBox.x - 20,
        y: definitionBox.y - 20,
        width: definitionBox.width + 40,
        height: definitionBox.height + 40
      }
    });
    console.log('✅ Definition box saved: definition-box.png');
  }

  // ==========================================
  // 3. HOW IT WORKS SECTION
  // ==========================================
  console.log('📸 Capturing How It Works Section...');

  await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 2 });

  const howItWorksElement = await page.$('#how-it-works');
  if (howItWorksElement) {
    await howItWorksElement.screenshot({
      path: path.join(screenshotsDir, 'how-it-works.png'),
      type: 'png'
    });
    console.log('✅ How It Works section saved: how-it-works.png');
  }

  // ==========================================
  // 4. FEATURES SECTION
  // ==========================================
  console.log('📸 Capturing Features Section...');

  await page.setViewport({ width: 1400, height: 1400, deviceScaleFactor: 2 });

  const featuresElement = await page.$('#features');
  if (featuresElement) {
    await featuresElement.screenshot({
      path: path.join(screenshotsDir, 'features.png'),
      type: 'png'
    });
    console.log('✅ Features section saved: features.png');
  }

  // ==========================================
  // 5. DEMO SECTION (READY STATE)
  // ==========================================
  console.log('📸 Capturing Demo Section...');

  await page.setViewport({ width: 1200, height: 1000, deviceScaleFactor: 2 });

  const demoElement = await page.$('#demo');
  if (demoElement) {
    await demoElement.screenshot({
      path: path.join(screenshotsDir, 'demo-section.png'),
      type: 'png'
    });
    console.log('✅ Demo section saved: demo-section.png');
  }

  // ==========================================
  // 6. FULL PAGE SCREENSHOT
  // ==========================================
  console.log('📸 Capturing Full Page...');

  await page.setViewport({ width: 1200, height: 1080, deviceScaleFactor: 2 });

  await page.screenshot({
    path: path.join(screenshotsDir, 'full-page.png'),
    type: 'png',
    fullPage: true
  });
  console.log('✅ Full page saved: full-page.png');

  // ==========================================
  // 7. MOBILE VIEW - HERO
  // ==========================================
  console.log('📸 Capturing Mobile Hero View...');

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 }); // iPhone 14 Pro

  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  const mobileHeroElement = await page.$('section');
  if (mobileHeroElement) {
    await mobileHeroElement.screenshot({
      path: path.join(screenshotsDir, 'hero-mobile.png'),
      type: 'png'
    });
    console.log('✅ Mobile hero saved: hero-mobile.png');
  }

  console.log('\n🎉 All screenshots captured successfully!\n');

  // Generate summary
  const files = await fs.readdir(screenshotsDir);
  console.log('📋 Generated screenshots:');
  for (const file of files) {
    const stats = await fs.stat(path.join(screenshotsDir, file));
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ${file} - ${sizeKB} KB`);
  }

} catch (error) {
  console.error('\n❌ Error capturing screenshots:', error.message);
  console.error('\n💡 Make sure the dev server is running at http://localhost:3000');
  process.exit(1);
} finally {
  await browser.close();
}

console.log('\n✨ Screenshots are ready in /public/screenshots/\n');

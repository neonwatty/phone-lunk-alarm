import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const imagesDir = path.join(publicDir, 'images');

// Brand colors
const PRIMARY_COLOR = '#A4278D';
const ACCENT_COLOR = '#F9F72E';
const _BACKGROUND_COLOR = '#111827';

// Ensure images directory exists
await fs.mkdir(imagesDir, { recursive: true });

console.log('🎨 Phone Lunk Image Generation Starting...\n');

// Step 1: Convert SVG to PNG buffer for manipulation
const svgPath = path.join(publicDir, 'favicon.svg');
const svgBuffer = await fs.readFile(svgPath);

// ==========================================
// FAVICON GENERATION
// ==========================================

console.log('📦 Generating favicons...');

const sizes = [16, 32, 48, 96, 180];

for (const size of sizes) {
  const pngBuffer = await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toBuffer();

  if (size === 16) {
    await sharp(pngBuffer).toFile(path.join(publicDir, 'favicon-16x16.png'));
  } else if (size === 32) {
    await sharp(pngBuffer).toFile(path.join(publicDir, 'favicon-32x32.png'));
  } else if (size === 96) {
    await sharp(pngBuffer).toFile(path.join(publicDir, 'favicon-96x96.png'));
  } else if (size === 180) {
    await sharp(pngBuffer).toFile(path.join(imagesDir, 'apple-touch-icon.png'));
    await sharp(pngBuffer).toFile(path.join(imagesDir, 'apple-touch-icon-180x180.png'));
  }
}

// Generate favicon.ico (using 32x32 as primary)
const favicon32Buffer = await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toBuffer();

await fs.writeFile(path.join(publicDir, 'favicon.ico'), favicon32Buffer);

console.log('✅ Favicons generated: 16x16, 32x32, 96x96, favicon.ico');

// ==========================================
// APPLE TOUCH ICONS
// ==========================================

console.log('\n🍎 Generating Apple Touch Icons...');

const appleSizes = [152, 167, 180];

for (const size of appleSizes) {
  const pngBuffer = await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toBuffer();

  await sharp(pngBuffer).toFile(
    path.join(imagesDir, `apple-touch-icon-${size}x${size}.png`)
  );
}

console.log('✅ Apple Touch Icons generated: 152x152, 167x167, 180x180');

// ==========================================
// PWA ICONS
// ==========================================

console.log('\n📱 Generating PWA Icons...');

const pwaSizes = [192, 512];

for (const size of pwaSizes) {
  // Regular icons
  const pngBuffer = await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toBuffer();

  await sharp(pngBuffer).toFile(
    path.join(imagesDir, `icon-${size}x${size}.png`)
  );

  // Maskable icons (with safe zone padding)
  const paddingPercent = 0.1; // 10% padding for safe zone
  const paddedSize = Math.round(size * (1 - paddingPercent * 2));
  const padding = Math.round((size - paddedSize) / 2);

  const maskableBuffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: PRIMARY_COLOR
    }
  })
  .composite([{
    input: await sharp(svgBuffer).resize(paddedSize, paddedSize).png().toBuffer(),
    top: padding,
    left: padding
  }])
  .png()
  .toBuffer();

  await sharp(maskableBuffer).toFile(
    path.join(imagesDir, `icon-maskable-${size}x${size}.png`)
  );
}

console.log('✅ PWA Icons generated: 192x192, 512x512 (regular & maskable)');

// ==========================================
// OPEN GRAPH IMAGE GENERATION
// ==========================================

console.log('\n🖼️  Generating Open Graph Image...');

// Create OG image: 1200x630 with branding
const ogWidth = 1200;
const ogHeight = 630;

// Load gym background frame
const bgFramePath = path.join(imagesDir, 'og-background.jpg');
const bgFrame = await sharp(bgFramePath)
  .resize(ogWidth, ogHeight, {
    fit: 'cover',       // Crop to fill 1200x630
    position: 'center'  // Center crop
  })
  .toBuffer();

// Create SVG overlay with detection elements (transparent background)
const overlaySvg = `
<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 0.3 0 0 0
        0 0 0.3 0 0
        0 0 0 0.6 0"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Drop shadow for text readability -->
    <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.8"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Semi-transparent dark overlay for contrast -->
  <rect width="${ogWidth}" height="${ogHeight}" fill="black" opacity="0.35"/>

  <!-- Detection scene centered -->
  <g transform="translate(600, 315)">
    <!-- Outer red alarm rings -->
    <circle cx="0" cy="0" r="280" fill="none" stroke="#DC2626" stroke-width="4" opacity="0.4"/>
    <circle cx="0" cy="0" r="240" fill="none" stroke="#DC2626" stroke-width="5" opacity="0.5"/>
    <circle cx="0" cy="0" r="200" fill="none" stroke="#EF4444" stroke-width="6" opacity="0.6"/>

    <!-- Red glow -->
    <circle cx="0" cy="0" r="180" fill="#DC2626" opacity="0.25"/>

    <!-- Detection bounding box (larger, around where phone would be) -->
    <rect x="-100" y="-140" width="200" height="280" rx="12"
          fill="none" stroke="#EF4444" stroke-width="8" opacity="0.95"/>

    <!-- Corner brackets -->
    <path d="M -100,-140 L -100,-100 M -100,-140 L -60,-140"
          stroke="#EF4444" stroke-width="12" stroke-linecap="round" opacity="0.95"/>
    <path d="M 100,-140 L 100,-100 M 100,-140 L 60,-140"
          stroke="#EF4444" stroke-width="12" stroke-linecap="round" opacity="0.95"/>
    <path d="M -100,140 L -100,100 M -100,140 L -60,140"
          stroke="#EF4444" stroke-width="12" stroke-linecap="round" opacity="0.95"/>
    <path d="M 100,140 L 100,100 M 100,140 L 60,140"
          stroke="#EF4444" stroke-width="12" stroke-linecap="round" opacity="0.95"/>

    <!-- Detection label with shadow for readability -->
    <g filter="url(#textShadow)">
      <rect x="-130" y="-200" width="260" height="55" rx="8" fill="#EF4444" opacity="0.98"/>
      <rect x="-128" y="-198" width="256" height="51" rx="7" fill="none" stroke="#FF6666" stroke-width="2"/>
      <text x="0" y="-168" font-family="Arial, sans-serif" font-size="26"
            font-weight="bold" text-anchor="middle" fill="white">
        📱 PHONE LUNK DETECTED
      </text>
    </g>
  </g>

  <!-- Alert text at top with shadow -->
  <g filter="url(#textShadow)">
    <text x="600" y="80" font-family="Arial, sans-serif" font-size="52"
          font-weight="bold" text-anchor="middle" fill="#EF4444">
      PHONE LUNK DETECTED
    </text>
  </g>

  <!-- Definition and branding at bottom with shadow -->
  <g filter="url(#textShadow)">
    <text x="600" y="550" font-family="Arial, sans-serif" font-size="32"
          font-weight="600" font-style="italic" text-anchor="middle" fill="${ACCENT_COLOR}">
      Doom-scrolling equipment hog
    </text>
    <text x="600" y="595" font-family="Arial, sans-serif" font-size="28"
          font-weight="600" text-anchor="middle" fill="white">
      phone-lunk.app
    </text>
  </g>
</svg>
`;

// Composite background + overlay
await sharp(bgFrame)
  .composite([{
    input: Buffer.from(overlaySvg),
    top: 0,
    left: 0
  }])
  .jpeg({ quality: 90 })
  .toFile(path.join(imagesDir, 'og-image.jpg'));

console.log('✅ Open Graph image generated: 1200x630');

// ==========================================
// TWITTER CARD IMAGE (same as OG)
// ==========================================

console.log('\n🐦 Generating Twitter Card Image...');

// Use same composite approach as OG image
await sharp(bgFrame)
  .composite([{
    input: Buffer.from(overlaySvg),
    top: 0,
    left: 0
  }])
  .jpeg({ quality: 90 })
  .toFile(path.join(imagesDir, 'twitter-card.jpg'));

console.log('✅ Twitter Card image generated: 1200x630');

console.log('\n🎉 All images generated successfully!\n');

// Generate summary report
const files = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-96x96.png',
  'images/apple-touch-icon.png',
  'images/apple-touch-icon-152x152.png',
  'images/apple-touch-icon-167x167.png',
  'images/apple-touch-icon-180x180.png',
  'images/icon-192x192.png',
  'images/icon-512x512.png',
  'images/icon-maskable-192x192.png',
  'images/icon-maskable-512x512.png',
  'images/og-image.jpg',
  'images/twitter-card.jpg'
];

console.log('📋 Generated files:');
for (const file of files) {
  const filePath = path.join(publicDir, file);
  try {
    const stats = await fs.stat(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ${file} - ${sizeKB} KB`);
  } catch (error) {
    console.log(`   ${file} - ERROR: ${error.message}`);
  }
}

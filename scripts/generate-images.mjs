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
const BACKGROUND_COLOR = '#111827';

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

// Create SVG for OG image with text
const ogSvg = `
<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${ACCENT_COLOR};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bgGrad)"/>

  <!-- Alarm icon (large, centered-left) -->
  <g transform="translate(150, 165)">
    <rect width="300" height="300" rx="60" fill="url(#logoGrad)"/>
    <circle cx="150" cy="105" r="45" fill="#FF0000" opacity="0.9"/>
    <circle cx="150" cy="105" r="30" fill="#FF4444" opacity="0.8"/>
    <rect x="105" y="135" width="90" height="60" rx="9" fill="#1a1a1a"/>
    <rect x="90" y="195" width="120" height="24" rx="12" fill="#333333"/>
    <text x="150" y="174" font-size="60" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">!</text>
  </g>

  <!-- Text content -->
  <text x="550" y="220" font-family="Arial, sans-serif" font-size="84" font-weight="bold" fill="white">
    PHONE LUNK
  </text>
  <text x="550" y="310" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${ACCENT_COLOR}">
    Fuck Your Phone
  </text>
  <text x="550" y="410" font-family="Arial, sans-serif" font-size="32" fill="#E5E7EB" opacity="0.9">
    AI-powered phone detection
  </text>
  <text x="550" y="460" font-family="Arial, sans-serif" font-size="32" fill="#E5E7EB" opacity="0.9">
    for gyms that give a shit
  </text>

  <!-- Domain -->
  <text x="550" y="540" font-family="Arial, sans-serif" font-size="28" fill="${ACCENT_COLOR}" opacity="0.8">
    phone-lunk.app
  </text>
</svg>
`;

await sharp(Buffer.from(ogSvg))
  .resize(ogWidth, ogHeight)
  .jpeg({ quality: 90 })
  .toFile(path.join(imagesDir, 'og-image.jpg'));

console.log('✅ Open Graph image generated: 1200x630');

// ==========================================
// TWITTER CARD IMAGE (same as OG)
// ==========================================

console.log('\n🐦 Generating Twitter Card Image...');

await sharp(Buffer.from(ogSvg))
  .resize(ogWidth, ogHeight)
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

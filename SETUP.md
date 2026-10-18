# Setup Guide

Detailed step-by-step instructions for setting up and deploying your landing page.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Configuration](#configuration)
3. [Customization](#customization)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [Custom Domain](#custom-domain-optional)
6. [Troubleshooting](#troubleshooting)

## Initial Setup

### Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Code editor (VS Code recommended)

### Step 1: Get the Template

```bash
# Option 1: Clone this repository
git clone https://github.com/yourusername/nextjs-landing-template.git my-landing-page
cd my-landing-page

# Option 2: Use as GitHub template
# Click "Use this template" on GitHub, then clone your new repo

# Install dependencies
npm install
```

### Step 2: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the template with default content.

## Configuration

### Site Configuration (`site.config.mjs`)

This is the most important file - all your site settings are here.

#### 1. Basic Site Information

```javascript
site: {
  name: 'My Awesome Product',  // Your product/site name
  tagline: 'Build something amazing',  // Short tagline
  description: 'A powerful tool that helps you...',  // SEO description
  url: 'https://yourusername.github.io/my-landing-page',  // Your GitHub Pages URL
  keywords: ['product', 'saas', 'tool'],  // SEO keywords
}
```

#### 2. Author/Company Info

```javascript
author: {
  name: 'Your Name',
  role: 'Product Builder',
  bio: 'Building innovative tools...',
  email: 'hello@example.com',
}
```

#### 3. Social Media Links

```javascript
social: {
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'mailto:hello@example.com',
}
```

Set any to `null` to hide that social link.

#### 4. Navigation Menu

```javascript
navigation: [
  { name: 'Features', href: '#features' },  // Anchor link
  { name: 'About', href: '/about' },  // Page link
  { name: 'Docs', href: '#docs' },
]
```

#### 5. Hero Section

```javascript
hero: {
  headline: 'Build Your Next Big Idea',
  subheadline: 'A powerful, easy-to-use platform...',
  primaryCTA: {
    text: 'Get Started',
    href: '#features',  // Can be external or internal link
  },
  secondaryCTA: {
    text: 'Learn More',
    href: '/about',
  },
  image: null,  // Optional: '/images/hero-image.png'
}
```

#### 6. Features

```javascript
features: [
  {
    title: 'Lightning Fast',
    description: 'Optimized for performance...',
    icon: 'bolt',  // Heroicons icon name
  },
  // Add more features...
]
```

**Available Heroicons**: `bolt`, `cog-6-tooth`, `rocket-launch`, `moon`, `code-bracket`, `magnifying-glass`, `shield-check`, `sparkles`, etc.

Find more at: https://heroicons.com (use outline style names)

#### 7. Call-to-Action

```javascript
cta: {
  headline: 'Ready to Get Started?',
  description: 'Join thousands of developers...',
  buttonText: 'Start Building',
  buttonHref: '#',  // Your signup/download link
}
```

#### 8. SEO Settings

```javascript
seo: {
  titleTemplate: '%s | My Product',  // Page title format
  defaultTitle: 'My Product - Tagline',
  description: 'Your SEO description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/og-image.jpg',  // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: 'My Product',
      },
    ],
  },
  twitter: {
    handle: '@yourusername',
    cardType: 'summary_large_image',
  },
}
```

#### 9. Analytics

```javascript
analytics: {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || null,
  vercelAnalytics: true,  // Set to false if not using Vercel
  vercelSpeedInsights: true,
}
```

### Environment Variables

Create a `.env.local` file for local development:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional
```

**Important**: Never commit `.env.local` to Git (it's already in `.gitignore`)

## Customization

### Adding Images

1. Place images in `public/images/`
2. Reference them in config or components: `/images/your-image.png`

**Recommended images**:
- Logo: Any size, SVG or PNG
- Hero image: 800-1200px wide
- OG Image (social preview): 1200x630px
- Apple Touch Icon: 180x180px
- Favicon: Already included (edit `public/favicon.svg`)

### Customizing Colors

#### Method 1: In `site.config.mjs`

```javascript
theme: {
  primaryColor: '#6366F1',  // Indigo
  accentColor: '#8B5CF6',   // Purple
}
```

#### Method 2: In `app/globals.css`

Modify CSS custom properties:

```css
:root {
  --color-accent-primary: #6366F1;
  --color-accent-hover: #4F46E5;
  /* ... more variables */
}
```

### Customizing Typography

Fonts are configured in `app/layout.tsx`:

```typescript
const inter = Inter({ /* ... */ })
const poppins = Poppins({ /* ... */ })
```

Change to other Google Fonts or custom fonts as needed.

### Creating Custom Pages

1. **Create page file**:
```bash
mkdir app/pricing
touch app/pricing/page.tsx
```

2. **Add page content**:
```typescript
// app/pricing/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Pricing',
}

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Your pricing content */}
      </main>
      <Footer />
    </div>
  )
}
```

3. **Add to navigation** in `site.config.mjs`:
```javascript
navigation: [
  { name: 'Pricing', href: '/pricing' },
]
```

## GitHub Pages Deployment

### Step 1: Create GitHub Repository

```bash
# Initialize Git (if not already done)
git init

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/my-landing-page.git
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**

### Step 3: Update Site URL

In `site.config.mjs`:

```javascript
site: {
  url: 'https://yourusername.github.io/my-landing-page',
}
```

### Step 4: (Optional) Add Environment Variables

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **Variables** tab → **New repository variable**
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://yourusername.github.io/my-landing-page`

3. (Optional) For Google Analytics, go to **Secrets** tab:
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: Your GA ID (e.g., `G-XXXXXXXXXX`)

### Step 5: Deploy

```bash
git add .
git commit -m "Initial deployment"
git push -u origin main
```

The GitHub Action will automatically:
- Install dependencies
- Build your site
- Deploy to GitHub Pages

Check the **Actions** tab to monitor progress.

Your site will be live at: `https://yourusername.github.io/my-landing-page`

### Deployment Checklist

- [ ] Repository created on GitHub
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Site URL updated in `site.config.mjs`
- [ ] Code pushed to `main` branch
- [ ] GitHub Action completed successfully
- [ ] Site accessible at GitHub Pages URL

## Custom Domain (Optional)

### Step 1: Configure Domain

1. Add a `CNAME` file to `public/`:
```bash
echo "yourdomain.com" > public/CNAME
```

2. Configure DNS with your domain provider:
```
Type: CNAME
Name: www (or @)
Value: yourusername.github.io
```

### Step 2: Update Site URL

In `site.config.mjs`:
```javascript
site: {
  url: 'https://yourdomain.com',
}
```

### Step 3: Enable HTTPS

1. Go to GitHub Settings → Pages
2. Check "Enforce HTTPS"

Allow 24-48 hours for DNS propagation.

## Troubleshooting

### Build Fails

**Issue**: `npm run build` fails

**Solutions**:
- Check for TypeScript errors: `npm run type-check`
- Check for linting errors: `npm run lint`
- Clear cache: `npm run dev:clean`

### Images Not Loading

**Issue**: Images show broken in production

**Solutions**:
- Ensure images are in `public/` directory
- Use absolute paths: `/images/photo.png` not `./images/photo.png`
- Check image file names match exactly (case-sensitive)

### Styles Look Wrong

**Issue**: Tailwind styles not applying

**Solutions**:
- Rebuild: `npm run build`
- Check `tailwind.config.js` content paths include your files
- Ensure CSS is imported in `app/layout.tsx`

### GitHub Pages 404

**Issue**: Site shows 404 after deployment

**Solutions**:
- Verify GitHub Pages is enabled (Settings → Pages)
- Check Source is set to "GitHub Actions"
- Ensure Action completed successfully (Actions tab)
- Wait a few minutes after first deployment

### Navigation Links Not Working

**Issue**: Internal links cause 404

**Solutions**:
- Use Next.js `Link` component for internal navigation
- Anchor links need existing target: `<div id="features">`
- Check `next.config.mjs` has `output: 'export'`

## Next Steps

- ✅ Customize all content in `site.config.mjs`
- ✅ Add your images to `public/images/`
- ✅ Test locally with `npm run dev`
- ✅ Deploy to GitHub Pages
- ✅ (Optional) Set up custom domain
- ✅ (Optional) Add Google Analytics
- ✅ Share your awesome landing page!

## Need Help?

- Check [README.md](./README.md) for overview
- Review [Next.js documentation](https://nextjs.org/docs)
- Check [Tailwind CSS docs](https://tailwindcss.com/docs)
- Open an issue on GitHub

---

Happy building! 🚀

## Landing-page detection preview

The preview uses [RT-DETR R50](https://huggingface.co/onnx-community/rtdetr_r50vd)
through Transformers.js in a Web Worker. It downloads the FP32 model (about
175 MB, cached by the browser), then analyzes the recorded clip locally at two
samples per second. The full frame and a central crop are both inspected.
Initial analysis can take a minute or more depending on the device.

Playback uses these session-local predictions, with position interpolation
between accepted detections. It does not use authored coordinates or a saved
track file. A new track requires a score of 0.4; an existing track can follow
nearby, similarly sized phone predictions scoring at least 0.18. Missing
predictions clear the box. Model resources are released after analysis.
Camera permission is not requested by the preview, and frames are not uploaded.
The live camera detector remains a separate COCO-SSD implementation.

To reproduce the frame benchmark (requires FFmpeg):

```sh
mkdir -p /tmp/phone-lunk-frames
ffmpeg -i public/images/examples/phone-lunk-1.mp4 -vf fps=2 /tmp/phone-lunk-frames/frame-%02d.png
node scripts/check-phone-model.mjs /tmp/phone-lunk-frames /tmp/phone-lunk-results.json
```

The script reports real model scores and boxes without tracking or interpolation.

## Smaller-model comparison

Open `/model-lab/` to compare seven RT-DETR variants and run actual continuous
inference on the clip. The right panel shows the exact analyzed frame, not a
box painted onto a newer frame. Each run excludes one warmup frame and measures
20 inferences including worker transfer, preprocessing, and postprocessing.
Models load only after pressing **Run live check**. Stop terminates the worker.
WebGPU errors are surfaced rather than silently falling back to CPU.

The checked-in screening data in `docs/benchmarks/` was measured on an Apple
M5 Max. It is **not a phone benchmark**. All tests use acquisition score 0.40,
continuation score 0.18, and the production association logic. Coverage is not
precision/recall: these are one clip's model-supported tracks, without human
annotations. The blank-image negative control is only a basic sanity check.

Reproduce the seven-model screen and denser candidate check:

```sh
mkdir -p /tmp/phone-lunk-screen /tmp/phone-lunk-dense
ffmpeg -i public/images/examples/phone-lunk-1.mp4 -vf fps=2 /tmp/phone-lunk-screen/frame-%03d.png
node scripts/benchmark-phone-models.mjs /tmp/phone-lunk-screen /tmp/screen.json
ffmpeg -i public/images/examples/phone-lunk-1.mp4 -vf fps=10 /tmp/phone-lunk-dense/frame-%03d.png
CANDIDATE=r18-o365-q8 SAMPLE_FPS=10 node scripts/benchmark-phone-models.mjs /tmp/phone-lunk-dense /tmp/r18-q8.json
CANDIDATE=r18-o365-fp32 SAMPLE_FPS=10 node scripts/benchmark-phone-models.mjs /tmp/phone-lunk-dense /tmp/r18-fp32.json
```

The script also records incompatible candidates as errors (YOLOv10n is not
supported by the installed Transformers.js object-detection pipeline). It
compares full-frame, crop-only, and combined passes. Weight size excludes runtime
assets and activation memory. Node timings are warm inference timings, not cold
model download time. The original landing preview and camera model are unchanged
by the lab; a deployment choice still needs an actual phone/browser benchmark.

### Verified GPU export (local model lab)

The lab's default is now R18 Objects365 FP32 with a fixed `[1,3,640,640]`
export. Three 2×2/stride-2 AveragePool nodes receive even spatial dimensions
(160, 80, 40), so ceil rounding is unnecessary. The preparation script checks
these invariants and the source SHA-256 before changing those three attributes.
It verifies CPU numerical parity before writing the generated model. Browser
validation additionally compares original CPU and prepared GPU predictions on
nine identical clip frames plus a blank negative.

ONNX Runtime Web is pinned to 1.30.0 via an npm override. Its matching WASM
assets are loaded from jsDelivr; do not mix that runtime with the older WASM
files bundled by Transformers.js. Upgrading the runtime alone does not fix the
ceil-pooling limitation. The INT8 export is **not enabled on GPU**: its numerical
parity check failed. Camera inference is still the separate COCO-SSD path.

Prepare the FP32 export before using the lab on a fresh checkout:

```sh
python3 -m venv /tmp/phone-lunk-onnx-tools
/tmp/phone-lunk-onnx-tools/bin/pip install onnx onnxruntime numpy
mkdir -p /tmp/phone-lunk-r18/onnx
curl -fL https://huggingface.co/onnx-community/rtdetr_r18vd_coco_o365/resolve/main/config.json -o /tmp/phone-lunk-r18/config.json
curl -fL https://huggingface.co/onnx-community/rtdetr_r18vd_coco_o365/resolve/main/preprocessor_config.json -o /tmp/phone-lunk-r18/preprocessor_config.json
curl -fL https://huggingface.co/onnx-community/rtdetr_r18vd_coco_o365/resolve/main/onnx/model.onnx -o /tmp/phone-lunk-r18/onnx/model.onnx
/tmp/phone-lunk-onnx-tools/bin/python scripts/prepare-gpu-model.py /tmp/phone-lunk-r18
```

The 82.5 MB generated weights under `public/models/r18-o365-gpu/` are ignored by
Git and included in a subsequent static build if present. They are experimental
local artifacts, not an automatic change to the camera or landing detector.
Keep the preparation receipt in `docs/benchmarks/gpu-export-parity.json`.

Live lab runs now sample each decoded frame once using video-frame callbacks,
run for at least 15 seconds and 20 frames, and age tracks with monotonic capture
time. The footage has only 10 fps: inference capacity is measured separately
from playback rate. The **Validate FP32 GPU against CPU** button is a repeatable
accuracy-regression check, not a benchmark of general detection accuracy.

### Camera model selection

The camera now offers GPU phone detection (R18 Objects365 FP32) and Standard detection (COCO-SSD), remembering the choice on this browser. See `docs/detector-model-choice.md` for the native iOS requirement and deferred physical-device evaluation.

A fresh checkout must prepare the ignored GPU assets before a production build:

```sh
python3 -m venv .venv-model
.venv-model/bin/pip install -r scripts/model-requirements.txt
.venv-model/bin/python scripts/prepare-gpu-model.py
npm run build
```

The preparation command downloads source weights when no existing cache directory is supplied, verifies their checksum, and checks conversion parity. CI and Pages builds perform this step automatically. `prebuild` checks the verified export checksum and metadata, refusing to ship a missing or different model. Preparation requires network access and about 83 MB of model download. Development also needs these assets to use the GPU option.

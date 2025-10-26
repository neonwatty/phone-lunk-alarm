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

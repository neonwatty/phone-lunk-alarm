# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Phone Lunk is a Next.js 15 static landing page with an integrated AI-powered phone detection demo. The site is deployed to GitHub Pages and showcases real-time computer vision capabilities using TensorFlow.js running entirely in the browser.

**Key Architecture**: Static site generation (Next.js export mode) + client-side ML inference (no backend required).

## 🤖 Task Agent Usage Guidelines

**IMPORTANT**: Use specialized Task agents liberally for exploration, planning, and research tasks.

### When to Use Task Agents

**Explore Agent** (use `subagent_type=Explore`):
- Understanding codebase structure and architecture
- Finding where features are implemented across multiple files
- Exploring error handling patterns, API endpoints, or design patterns
- Questions like "How does X work?", "Where is Y handled?", "What's the structure of Z?"
- Set thoroughness: `quick` (basic), `medium` (moderate), or `very thorough` (comprehensive)

**Plan Agent** (use `subagent_type=Plan`):
- Breaking down complex feature implementations
- Designing multi-step refactoring approaches
- Planning architectural changes or migrations

**General-Purpose Agent** (use `subagent_type=general-purpose`):
- Multi-step tasks requiring multiple tool invocations
- Documentation lookups via WebSearch/WebFetch
- Complex searches across many files with multiple rounds

## Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start dev server on http://localhost:3000 (uses custom server.mjs)

# Building
npm run build            # Full production build (includes prebuild, build, postbuild)
npm run prebuild         # Generate logo images from SVG
npm run postbuild        # Generate sitemap

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run type-check       # TypeScript strict mode checking

# Testing
npm run test             # Jest unit tests (watch mode)
npm run test:ci          # Jest with coverage (CI mode, 20% coverage threshold)
npm run test:e2e         # Playwright end-to-end tests

# Utilities
npm run dev:clean        # Clean .next directory and restart dev server
npm run generate:images  # Manually regenerate logo images
```

### Running Single Tests
```bash
# Jest - specific test file
npm run test -- PhoneDetector.test.tsx

# Jest - watch specific file
npm run test -- --watch PhoneDetector.test.tsx

# Playwright - specific test
npx playwright test tests/example.spec.ts
```

## Code Architecture

### 1. Configuration-Driven Design

**All customizable content lives in `site.config.mjs`**. This single file controls:
- Site metadata (name, tagline, description, SEO)
- Navigation menu items
- Hero section content (headline, CTAs)
- How It Works steps (3 steps with emojis)
- Features list (6 features with Heroicons)
- Social links, analytics IDs, theme colors

When adding new content sections, follow this pattern: add config to `site.config.mjs`, then import and map in the component.

### 2. Static Export Configuration

The app uses Next.js static export mode (`output: 'export'` in `next.config.mjs`):
- All pages must be exportable as static HTML
- No server-side rendering (SSR) or API routes
- Images must be `unoptimized: true`
- Dynamic imports required for client-only code (especially TensorFlow.js)

### 3. PhoneDetector Component Architecture

The core feature is `components/PhoneDetector.tsx` (459 lines). This component handles:

**AI Model Loading**:
- Uses dynamic imports to avoid SSR issues: `import('@tensorflow/tfjs')` and `import('@tensorflow-models/coco-ssd')`
- Loads models only on client-side (`useEffect` after mount)
- COCO-SSD model detects "cell phone" class with 35% confidence threshold

**Detection Loop**:
- Runs at ~10 FPS (100ms intervals via `setInterval`)
- Reads webcam video frame → runs model prediction → draws bounding boxes on canvas
- 3-second cooldown between alarm triggers to prevent spam

**Camera Management**:
- Supports front/rear camera switching (mobile devices)
- Handles permissions, WebGL availability, and browser compatibility
- Comprehensive error states for: camera denied, WebGL missing, model load failure

**State Management**:
```typescript
const [isDetecting, setIsDetecting] = useState(false)
const [detectionCount, setDetectionCount] = useState(0)
const [showAlarm, setShowAlarm] = useState(false)
const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
```

**Important**: When modifying PhoneDetector:
1. Test on both desktop (webcam) and mobile (front/rear cameras)
2. Verify model loads without SSR errors (check dynamic imports)
3. Ensure detection loop cleanup in `useEffect` return

### 4. Theme System

Dark/light mode using React Context (`components/ThemeProvider.tsx`):
- Theme stored in `localStorage` with `'theme'` key
- CSS variables defined in `app/globals.css` with `[data-theme="dark"]` and `[data-theme="light"]` selectors
- ThemeToggle component provides UI for switching
- All colors reference CSS variables (e.g., `var(--color-text-primary)`)

When adding new themed elements, use existing CSS variables from `globals.css` instead of hardcoded colors.

### 5. Testing Strategy

**Unit Tests** (`__tests__/`):
- Focus on component rendering and basic interactions
- Mock TensorFlow.js and react-webcam to avoid browser dependencies
- Most comprehensive tests in `PhoneDetector.test.tsx`

**E2E Tests** (Playwright):
- Test user flows across pages
- Verify navigation, forms, and interactions

**Coverage**: 20% minimum threshold (intentionally low for static landing page).

When adding new components, prioritize testing:
1. Rendering with different props
2. User interactions (clicks, form submissions)
3. Edge cases and error states

## Project Structure Notes

### Directory Layout
```
app/                    # Next.js App Router pages
  layout.tsx           # Root layout with metadata, fonts, analytics
  page.tsx             # Home page (Hero + Features + PhoneDetector + CTA)
  globals.css          # Design system CSS variables
  about/page.tsx       # About page
  waitlist/page.tsx    # Email signup page
  not-found.tsx        # Custom 404

components/            # Reusable React components
  PhoneDetector.tsx    # AI demo (459 lines) - THE CORE FEATURE
  AlarmEffect.tsx      # Visual alarm animation triggered by detection
  VideoMockup.tsx      # Demo video display component
  Header.tsx           # Nav with theme toggle
  Footer.tsx           # Footer with social links
  Hero.tsx             # Hero section
  Features.tsx         # Feature grid
  HowItWorks.tsx       # 3-step process
  CTA.tsx              # Call-to-action banner
  Newsletter.tsx       # Newsletter signup (currently disabled)
  ThemeProvider.tsx    # Theme context
  ThemeToggle.tsx      # Theme switcher
  StructuredData.tsx   # SEO JSON-LD

public/                # Static assets (images, favicons, manifest)
scripts/               # Build utilities (image generation, screenshots)
.github/workflows/     # CI/CD (ci.yml runs tests, deploy.yml deploys to Pages)
```

### Key Files
- **`site.config.mjs`**: Single source of truth for all content
- **`next.config.mjs`**: Static export config, basePath for GitHub Pages
- **`app/globals.css`**: Design system with CSS variables for theming
- **`jest.config.js`**: Test configuration (jsdom, module aliases)
- **`playwright.config.ts`**: E2E test configuration

## Common Development Tasks

### Adding a New Page
1. Create directory in `app/` (e.g., `app/pricing/`)
2. Add `page.tsx` with default export component
3. Update navigation in `site.config.mjs`:
   ```javascript
   navigation: [
     { name: 'Pricing', href: '/pricing' },
   ]
   ```
4. Add metadata export in page.tsx for SEO

### Adding a New Feature to the Grid
1. Edit `site.config.mjs`:
   ```javascript
   features: [
     {
       title: 'New Feature',
       description: 'Description with [highlighted] words',
       icon: 'sparkles', // Heroicon name
     },
   ]
   ```
2. Features.tsx automatically renders from config

### Modifying AI Detection Parameters
In `components/PhoneDetector.tsx`:
- **Detection interval**: Change `100` in `setInterval(detect, 100)` (line ~200)
- **Confidence threshold**: Change `0.35` in prediction filtering (line ~180)
- **Alarm cooldown**: Change `3000` in alarm timer (line ~195)
- **Target object**: Change `'cell phone'` to detect other COCO-SSD classes

### Deployment Configuration

**GitHub Pages Setup**:
1. Repository Settings → Pages → Source: "GitHub Actions"
2. Push to `main` branch triggers deployment
3. For subdirectory deployment (e.g., `username.github.io/repo-name`):
   ```bash
   # Set environment variable
   NEXT_PUBLIC_BASE_PATH=/repo-name
   ```
4. For root domain (custom domain or `username.github.io`):
   - Leave `NEXT_PUBLIC_BASE_PATH` unset
   - Add CNAME file in `public/` directory

**CI/CD Pipeline**:
- `.github/workflows/ci.yml`: Runs lint, type-check, tests, build on every PR/push
- `.github/workflows/deploy.yml`: Deploys to Pages after CI passes (main branch only)

## Important Technical Constraints

1. **No SSR/Server Components**: All code must be exportable as static HTML. Use `'use client'` directive and dynamic imports for browser-only code.

2. **TensorFlow.js Loading**: Always use dynamic imports to avoid SSR errors:
   ```typescript
   useEffect(() => {
     const loadModel = async () => {
       const tf = await import('@tensorflow/tfjs')
       const cocoSsd = await import('@tensorflow-models/coco-ssd')
       // ...
     }
     loadModel()
   }, [])
   ```

3. **Image Optimization**: Images must be `unoptimized: true` for static export. Use Next.js `<Image>` component with explicit width/height.

4. **Path Aliases**: Use `@/` for imports relative to project root:
   ```typescript
   import Header from '@/components/Header'
   import siteConfig from '@/site.config.mjs'
   ```

5. **CSS Variables**: All theming uses CSS custom properties. Don't hardcode colors.

6. **Mobile Camera Access**: Test PhoneDetector on mobile devices. Front/rear camera switching only works on mobile browsers with `getUserMedia` support.

## Testing Phone Detection

**Desktop**: Requires webcam. Grant camera permissions when prompted.

**Mobile**: Works best on mobile devices with rear camera. Test both front and rear cameras using the "Switch Camera" button.

**Demo Flow**:
1. Click "Start Detection"
2. Grant camera permissions
3. Point camera at phone
4. Detection triggers alarm after ~100ms
5. Bounding box drawn on canvas overlay
6. Alarm effect displays for 3 seconds
7. 3-second cooldown before next alarm

**Common Issues**:
- "Camera access denied": User blocked camera permissions
- "WebGL not supported": Old browser or hardware acceleration disabled
- "Model failed to load": Network error or TensorFlow.js compatibility issue
- False positives: Lower confidence threshold (currently 35%)
- Slow detection: Reduce detection frequency or optimize canvas drawing

## SEO and Analytics

**SEO Implementation**:
- Metadata in `app/layout.tsx` and page-level `metadata` exports
- Open Graph and Twitter Card tags
- JSON-LD structured data in `components/StructuredData.tsx`
- Sitemap auto-generated via `next-sitemap` after build

**Analytics**:
- Google Analytics: Set `NEXT_PUBLIC_GA_ID` in GitHub Secrets
- Vercel Analytics: Enabled by default (opt-out in `site.config.mjs`)
- Google Tag Manager: GTM-MKS2GNDH (configured in layout.tsx)

## Design System

**Color Palette** (globals.css):
- Primary: Planet Fitness purple (#A4278D)
- Accent: Planet Fitness yellow (#F9F72E)
- Backgrounds: 3 levels (bg-primary, bg-secondary, bg-tertiary)
- Text: 3 levels (text-primary, text-secondary, text-tertiary)

**Typography**:
- Headings: Poppins (Google Fonts)
- Body: Inter (Google Fonts)
- Code: JetBrains Mono (Google Fonts)

**Effects**:
- Glassmorphism: `backdrop-blur-sm` + semi-transparent backgrounds
- Gradients: Professional, subtle, elevated, hero variants
- Shadows: Subtle, medium, large, professional variants

All design tokens are defined as CSS variables in `app/globals.css`.

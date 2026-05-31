# Phone Lunk

Phone Lunk is a playful AI phone detection demo for gyms. It uses browser-based object detection to spot phones on camera and explores a privacy-first kiosk concept for discouraging equipment hogging.

## What Exists Today

- Static Next.js site
- Browser-based phone detector demo
- Local camera processing in the demo
- Shareable alarm/recording workflow
- SEO pages for gym phone policies, equipment hogging, and the kiosk concept

## Development

```bash
npm install
npm run dev
npm run type-check
npm run lint
npm run test
npm run build
```

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` generates the production static site.
- `npm run type-check` runs TypeScript checks.
- `npm run lint` runs ESLint for app and component code.
- `npm run test` runs the Jest suite.
- `npm run test:e2e` runs Playwright tests.

## Deployment

The project is configured for static export and GitHub Pages deployment. Production builds generate the static site in `out/`.

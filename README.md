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
npm run dev:local
npm run type-check
npm run lint
npm run test
npm run build
```

Open **http://phone-lunk.localhost:3107/**. The `.localhost` subdomain resolves to this machine in modern browsers and supports local camera access. Keep the development server running during review; edits update automatically.

## Scripts

- `npm run dev:local` starts the local review server on port 3107.
- `npm run dev` starts Next.js on its default port.
- `npm run build` generates the production static site.
- `npm run type-check` runs TypeScript checks.
- `npm run lint` runs ESLint for app and component code.
- `npm run test` runs the Jest suite.
- `npm run test:e2e` runs Playwright tests.

## Deployment

The project is configured for static export and GitHub Pages deployment. Production builds generate the static site in `out/`.

### Vercel previews

`vercel.json` uses `scripts/build-vercel.sh` to prepare the verified GPU export before the normal Next.js build. It uses Python 3.12 and the same pinned model dependencies and parity checks as GitHub CI/Pages. Generated weights remain out of Git; the normal prebuild checksum guard stays enabled.

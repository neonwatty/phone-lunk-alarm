# Local UX walkthrough — October 16, 2026

Reviewed at http://phone-lunk.localhost:3107/ in local Chrome. Development server runs on loopback with hot reload; use `npm run dev:local` for subsequent reviews.

## Findings and changes

- Landing-to-camera navigation changed from the new orange/neutral palette back to green. Updated detector controls and surfaces to match the landing page in light and dark themes.
- Recording preview lacked modal keyboard behavior, an accessible close name, and a height limit for landscape screens. It now uses a native dialog, traps focus, closes on Escape, restores background scrolling, and scrolls internally on short screens.
- Removed the old “moment of justice” preview copy; clarified saving a recording versus sharing the app.
- Recorded the local subdomain convention in both agent instruction files and README.

## Verification

- Browser recognizes the subdomain as a secure context. Landing → detector navigation, GPU initialization, camera start, recording, download, camera stop, permission denial, and recovery were exercised.
- Camera capture used Chrome's synthetic media device. This checks the browser workflow, not real-world phone detection accuracy or physical iPhone compatibility.
- Downloaded WebM inspected with ffprobe: VP9, 1280×780, 111,597 bytes.
- At 667×375 the recording dialog stayed within the viewport; Shift+Tab kept focus inside it, Escape closed it, and Stop Camera returned to the off state.
- Injected NotAllowedError produced camera permission guidance and retry controls. Restoring access and choosing Try Again returned to monitoring.
- Landing checked at 320, 390, and 1440 pixels: no horizontal overflow; alert above the GIF; viewport-height sections; smooth navigation to How it works.
- 94 Jest tests pass, lint passes, TypeScript passes. Browser workflow reported no uncaught page errors.
- Final HTTP check returned 200; detached Next.js development server remained listening on loopback port 3107.

No social posts or messages were sent. Physical iPhone checks remain deferred.

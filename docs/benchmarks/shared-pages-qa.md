# Athletic Signal supporting-page QA

Local review: http://phone-lunk.localhost:3107/ on October 18, 2026.

- Shared colors, condensed headings, cards, buttons and focus indicators extended across supporting pages. Landing and detector retain their specific layouts.
- Chrome inspected landing, detector, About, Privacy, pilot form, all five guide pages, model lab, and 404 in light and dark mode at 320px. All returned the expected HTTP status and had no horizontal overflow; no uncaught page errors were reported.
- Desktop Privacy and mobile pilot-form screenshots inspected. Removed the legacy grid background after inspection; simplified form explanation without changing submission behavior.
- Lint, TypeScript, and all 94 Jest tests passed. No external form submitted during QA.
- Existing synthetic-camera validation remains documented in local-ux-review.md. No model or camera behavior changed in this styling pass.
- The initial Vercel deployment failure was resolved by preparing verified GPU assets before building. Vercel, GitHub quality, and recording E2E checks now pass. PR #26 remains draft and unmerged.

## Deployed preview review — October 18, 2026

Preview: https://phone-lunk-alarm-6agd41gnl-jermwatts-projects.vercel.app/

- Browser layout measurements across landing, detector, About, Privacy, pilot form, five guides, and model lab at 320px and 1440px found no horizontal document overflow. All eleven primary headings use Barlow Condensed.
- Visually inspected detector controls at 390px and desktop, expanded alarm settings, mobile navigation, About, Privacy, pilot form, a representative guide, model lab, and the 404 page. Checked light and dark treatments; the model lab intentionally retains its dark research layout.
- The GPU model reached the Start Camera state on the deployed detector. The narrow model comparison table scrolls within its card rather than expanding the page.
- No blocking styling defects found; no implementation changes made. This review did not start a camera, submit the pilot form, or repeat physical-iPhone testing.
- Local detector also reviewed in the browser at http://phone-lunk.localhost:3107/demo/.

## Review fixes and camera-first demo — October 18, 2026

- Renamed the demo to Phone Lunk Detector, with “Catch phone lunks in the act.” as its H2. Removed repeated instructions and descriptions; camera launch now precedes the viewfinder, with model and alarm options in a collapsed Settings panel below it.
- Recorder stop/cleanup now clears recording state and its timer, including inference-failure recovery. A component regression test starts recording, rejects inference, closes the preview, retries, and successfully starts another recording.
- A hidden-tab benchmark preserves its interruption status. Completion requires both 20 measured frames and 15 measured seconds. Component tests cover early interruption and normal completion.
- Both regression tests failed with their respective fixes temporarily removed, then passed after restoration. All 97 Jest tests, TypeScript, ESLint, and six local synthetic-camera/recording Playwright tests pass.
- Browser inspection at 320px, 390px, and 1440px found no horizontal overflow; reviewed collapsed and expanded settings. The local GPU detector reaches Start Camera. Physical iPhone testing remains deferred.

## Color and sound follow-up — October 18, 2026

- Demo now shares the landing page's cobalt background (#163dc7), equipment-yellow actions, viewfinder wordmark, and steel camera/control surfaces. Browser theme and manifest colors match as well.
- Checked the demo at 320px, 390px, and 1440px, with expanded sound settings and both theme selections. No horizontal page overflow; computed demo background remains rgb(22, 61, 199).
- Initially added synthesized Submarine and Fire Alert WAV effects; these have since been replaced by the recorded sources documented below. Both serve HTTP 200 locally, have nonzero PCM signal without clipping, and appear in the selector. Hook tests cover preview URLs and saved choices.
- All 99 Jest tests, TypeScript, ESLint, and diff whitespace checks pass. Settings structure is unchanged pending discussion; physical iPhone testing remains deferred.

## Settings interaction follow-up — October 18, 2026

- Settings opens directly to sound, preview, volume, and Mute. Advanced contains the optional detector model and visual controls. The disclosure shows the selected sound/volume or Muted, with explicit chevrons and reduced-motion support.
- New users default to Submarine; saved sound choices remain intact. Mute stops preview/alarm playback and restores the previous nonzero volume when unmuted within the session.
- All 101 Jest tests, TypeScript, and ESLint pass. Hook regressions cover the default versus saved choice and mute/unmute restoration. Mobile browser checks at 320px and 390px confirm no page overflow, usable Advanced controls, and matching summary/volume/preview states after mute and unmute.
- The request for more realistic audio and more screen space was subsequently confirmed; see the follow-up below. Changes remain local for review; PR stays draft and physical iPhone testing is deferred.

## Recorded alarms and camera space — October 18, 2026

- Replaced the synthesized Submarine and Fire Alert clips with edited CC0 recordings: jameswrowles’s mechanical Klaxon HEK E/75 and pushkin’s building fire alarm. Source pages, license links, editing details, and a checksum-verified preparation script are documented in public/sounds/CREDITS.md. Source recordings are publicly served high-quality MP3 previews; the bundled mono WAVs are roughly four seconds long.
- New-user default remains Submarine; existing sound choices remain intact. Both WAVs decode, have nonzero unclipped PCM, and serve HTTP 200 locally. Fire Alert’s Test sound action produced no browser errors.
- Expanded desktop camera width from 768px to 1024px at a 1440px viewport. At 390px, the camera width increased from 358px to 374px, while the Start Camera button moved from around y=261 to y=175. Camera frame and overlay geometry remain unchanged.
- Browser checks at 320px, 390px, and 1440px found no horizontal page overflow. All 101 Jest tests, TypeScript, ESLint, and whitespace checks pass. Changes remain local for review; physical iPhone validation is deferred.

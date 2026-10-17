# Agent Instructions

Follow existing project docs and keep changes small, tested, and scoped.

## Burden Of Proof

Before declaring work complete, try to disprove the change. Identify the
strongest realistic failure mode, verify it with a command, test, trace,
screenshot, audit record, diff, or direct inspection, and include that evidence
in the final handoff.

Treat `done`, `tests passed`, worker claims, passing happy-path tests, generated
summaries, and optimistic UI as claims, not proof. Treat unverified assumptions
as blockers or explicit follow-ups.

Keep this section synchronized with `CLAUDE.md` whenever either file changes.

## Local Review

Use `http://phone-lunk.localhost:3107/` for local previews, never bare localhost.
Start the development server with `npm run dev:local` so edits appear without rebuilding.
Before handing off, verify the server responds and review the app in a browser.

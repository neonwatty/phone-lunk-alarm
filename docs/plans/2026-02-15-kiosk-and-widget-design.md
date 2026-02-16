# Kiosk Mode & Embeddable Badge — Design

**Date:** 2026-02-15
**Status:** Approved

## Problem

Phone Lunk Alarm's core strength is its concept — "AI that catches phone scrollers in the gym." The concept itself is the viral hook. But right now the app only lives in a browser tab on an individual's phone. To spread further, the concept needs to escape the browser and show up in the real world where people encounter it organically and share it.

## Strategy

Make the concept more tangible, visible, and deployable by giving it a physical presence in gyms and a footprint on gym websites. Two features, one shared backend.

---

## Feature 1: Kiosk Mode

### What It Is

A full-screen display route (`/kiosk`) designed to run on a gym TV or mounted screen. It acts as a live scoreboard — gym members detect phone lunks on their own phones, and detections are pushed to the kiosk in real-time.

### User Flow

1. **Gym owner** visits `/kiosk/create`, names their gym, and gets a kiosk room
2. **Kiosk screen** displays full-screen: calm ambient state, gym branding, and a **QR code** in the corner
3. **Gym member** scans the QR code with their phone camera → lands on `phone-lunk.app/join/<room-id>` pre-connected to that room
4. **Member detects a phone lunk** on their phone → detection event pushed to the kiosk via WebSockets
5. **Kiosk fires the alarm** — detection alert, animation, sound. Shows a running feed of catches and a session counter.

### Kiosk UI

- **Full-screen, no chrome** — no header, footer, nav, or settings. Just the display.
- **Large, bold alerts** — readable from across a gym floor. High contrast, dramatic animations.
- **QR code** — always visible in the corner so new members can join mid-session.
- **Ambient "all clear" state** — when no detection is active, shows the gym name and a subtle animation so the screen doesn't look broken.
- **Session counter** — "17 phones caught today."
- **Recent catches feed** — the last few detection events with timestamps.
- **Auto-recovery** — if WebSocket drops, reconnect automatically. No user interaction needed.
- **Optional gym branding** — gym name displayed prominently, configured at room creation.

### Connection Architecture

- Members connect to the kiosk via a **room-based WebSocket channel**
- Room ID is embedded in the QR code URL — one scan, zero typing
- No accounts, no login — ephemeral sessions
- Multiple members can join the same room simultaneously
- Detection events are lightweight payloads (timestamp, anonymous ID) — no images or video are transmitted

---

## Feature 2: Embeddable Badge

### What It Is

A small, styled badge (~200x60px) that gym owners paste into their website with one line of HTML. It says "Phone Lunk Protected" and optionally shows a live detection count from their kiosk room.

### Embed Code

```html
<script src="https://phone-lunk.app/badge.js" data-gym="ROOM_ID"></script>
```

### Badge Behavior

- **With active kiosk room:** Shows live detection count — "23 phones caught today"
- **Without kiosk room:** Static badge that links to the main app
- **Click action:** Opens `phone-lunk.app` or the gym's kiosk join link
- **Style variants:** Dark/light, horizontal/vertical — fits different gym websites

### Technical

- Renders as a styled iframe
- Fetches detection count from the same API the kiosk uses
- Lightweight — no heavy JS bundle, no camera access, no TensorFlow

---

## Shared Backend

Both features share the same backend infrastructure:

### Components

1. **WebSocket relay** — routes detection events from connected members to the kiosk display for a given room
2. **Room management API** — create rooms, get room info, get detection counts
3. **Persistence** — store room metadata and detection counts (daily/total)

### Technology Options

- **WebSockets:** Supabase Realtime, Ably, Pusher, or a lightweight custom WebSocket server
- **Storage:** Vercel KV, Supabase Postgres, or Planetscale — just room records and counters
- **Hosting:** Same Vercel deployment as the existing app

### Data Model

- **Room:** `id`, `name`, `created_at`, `owner_token` (for managing the room)
- **Detection event:** `room_id`, `timestamp`, `anonymous_member_id` — ephemeral, not persisted long-term
- **Daily count:** `room_id`, `date`, `count` — for the badge and session counter

### Privacy

- No images or video are transmitted — only lightweight detection events
- No user accounts or personal data
- Member connections are anonymous
- Detection events are ephemeral — only aggregate counts are persisted

---

## What's NOT In Scope

- Global detection counter (revisit later)
- Live detector widget (iframe with camera — too heavy, camera permissions awkward on third-party domains)
- User accounts or authentication
- Video/image sharing through the kiosk
- Kiosk's own camera (kiosk is display-only, members are the detectors)

---

## Target Audience

- **Gym owners** who want a fun, gimmicky way to discourage phone hogging on equipment
- **Gym members** who are frustrated by phone scrollers and want to put them on blast
- **Content creators** and gym-goers who will photograph/film the kiosk in action and post about it organically

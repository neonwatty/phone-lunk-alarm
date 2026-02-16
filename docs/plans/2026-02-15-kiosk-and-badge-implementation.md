# Kiosk Mode & Embeddable Badge — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild phone-lunk-alarm on top of the nextjs-supabase-template, then add kiosk display mode and embeddable badge.

**Architecture:** Start from the template (Next.js 16, Supabase, auth, Tailwind 4, Vitest). Port the ~15 phone-lunk-alarm source files into `src/`. Add Supabase Realtime channels for kiosk ↔ member communication. Rooms are created by authenticated users, joined anonymously via QR code scan.

**Tech Stack:** Next.js 16, React 19, Supabase (Auth + Realtime + Postgres), `@supabase/ssr`, Tailwind 4, Vitest, Playwright, `qrcode.react`, TensorFlow.js + COCO-SSD.

**Template repo:** `https://github.com/neonwatty/nextjs-supabase-template`
**App repo:** `https://github.com/neonwatty/phone-lunk-alarm`
**Design doc:** `docs/plans/2026-02-15-kiosk-and-widget-design.md`

---

## Phase 1: Fork Template & Port Existing App

### Task 1: Set Up from Template

**Files:**
- All template files (fresh clone)
- Remove: template-specific files we don't need (Stripe, Resend, subscriptions)

**Step 1: Create new branch from template**

```bash
cd /tmp/phone-lunk-alarm
git checkout -b feat/kiosk-template-rebuild
```

**Step 2: Copy template structure**

Copy the following from the template into the phone-lunk-alarm repo, replacing existing files:

- `src/` directory (entire structure)
- `supabase/` directory
- `next.config.ts` (replaces `next.config.mjs`)
- `tsconfig.json`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.prettierrc`
- `vitest.config.ts`
- `playwright.config.ts`
- `.env.example`
- `.github/workflows/ci.yml`
- `src/middleware.ts`
- `src/lib/supabase/` (client trio)
- `src/lib/auth.ts`
- `src/lib/utils.ts`
- `src/app/(auth)/` (login, signup pages)
- `src/app/auth/callback/route.ts`
- `src/app/providers.tsx`
- `src/app/layout.tsx` (template root layout)
- `src/app/globals.css` (Tailwind 4)
- `src/components/sign-out-button.tsx`
- `src/test/` (test setup + mocks)

**Step 3: Remove template features we don't need yet**

Delete these template files:
- `src/lib/stripe/` (entire directory)
- `src/lib/subscription/` (entire directory)
- `src/lib/email/` (entire directory)
- `src/app/api/stripe/` (webhook)
- `src/app/api/cron/` (reminders)
- `src/app/api/email/` (webhook)
- `src/hooks/useSubscription.ts`
- `src/store/useStore.ts`
- `src/lib/validation.ts` (bring back if needed)
- `src/types/index.ts` (will rewrite for our types)
- `supabase/migrations/00002_subscriptions.sql`

**Step 4: Update package.json**

Merge dependencies — keep template's core deps, add phone-lunk-alarm specific ones:

Keep from template:
- `next`, `react`, `react-dom` (16/19)
- `@supabase/ssr`, `@supabase/supabase-js`
- `tailwindcss` (v4), `@tailwindcss/postcss`
- `clsx`, `tailwind-merge`, `lucide-react`
- `zod`
- `vitest`, `@playwright/test`, `@testing-library/*`
- `typescript`, `eslint`, `prettier`
- `@vercel/analytics`

Add from phone-lunk-alarm:
- `@tensorflow/tfjs`
- `@tensorflow-models/coco-ssd`
- `react-webcam`
- `react-hot-toast`
- `date-fns`
- `@heroicons/react`
- `@vercel/speed-insights`
- `qrcode.react` (new)

Remove (no longer needed):
- `@capacitor/*` (skip iOS for now)
- `stripe`, `resend`, `react-email`
- `zustand` (not needed unless state grows)

**Step 5: Install and verify build**

```bash
npm install
npm run build
```

Fix any build errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: bootstrap from nextjs-supabase-template with auth and Supabase infra"
```

---

### Task 2: Port Phone Detection Components

**Files:**
- Create: `src/components/PhoneDetector.tsx` (from `components/PhoneDetector.tsx`)
- Create: `src/components/AlarmEffect.tsx` (from `components/AlarmEffect.tsx`)
- Create: `src/components/SoundSelector.tsx`
- Create: `src/components/ThemeSelector.tsx`
- Create: `src/components/RecordingPreviewModal.tsx`
- Create: `src/hooks/useAlarmSound.ts`
- Create: `src/lib/alarm-themes.ts`
- Create: `src/lib/video-utils.ts`
- Copy: `public/sounds/` (all 4 alarm sound files)
- Copy: `public/manifest.json`

**Step 1: Copy core component files**

Copy from the old repo structure into `src/`:

| Old path | New path |
|----------|----------|
| `components/PhoneDetector.tsx` | `src/components/PhoneDetector.tsx` |
| `components/AlarmEffect.tsx` | `src/components/AlarmEffect.tsx` |
| `components/SoundSelector.tsx` | `src/components/SoundSelector.tsx` |
| `components/ThemeSelector.tsx` | `src/components/ThemeSelector.tsx` |
| `components/RecordingPreviewModal.tsx` | `src/components/RecordingPreviewModal.tsx` |
| `hooks/useAlarmSound.ts` | `src/hooks/useAlarmSound.ts` |
| `lib/alarm-themes.ts` | `src/lib/alarm-themes.ts` |
| `lib/video-utils.ts` | `src/lib/video-utils.ts` |
| `public/sounds/*` | `public/sounds/*` |

**Step 2: Fix imports**

All imports in the ported files that use `@/` should already work since tsconfig maps `@/*` to `./src/*`. Verify and fix any broken imports.

Key changes:
- `import { ALARM_THEMES } from '@/lib/alarm-themes'` (unchanged)
- `import { useAlarmSound } from '@/hooks/useAlarmSound'` (unchanged)
- Any Tailwind class changes needed for v3→v4 migration

**Step 3: Adapt Tailwind classes**

Tailwind 4 has breaking changes from v3. Key things to check in ported components:
- CSS variable references: the template uses `--background`, `--foreground`, etc. The old app uses `--bg-primary`, `--text-primary`, etc.
- Decision: map the old CSS variables to the template's oklch color system in `globals.css`, OR update the component classes to use the template's variable names.
- Simpler approach: add the old app's CSS variables to `globals.css` alongside the template's, then migrate component-by-component later.

**Step 4: Verify PhoneDetector renders**

```bash
npm run dev
```

Navigate to the demo page, verify the PhoneDetector component loads and shows the camera UI.

**Step 5: Commit**

```bash
git add src/components/ src/hooks/ src/lib/alarm-themes.ts src/lib/video-utils.ts public/sounds/
git commit -m "feat: port phone detection components from existing app"
```

---

### Task 3: Port Landing Page Components

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/HowItWorks.tsx`
- Create: `src/components/Features.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/VideoMockup.tsx`
- Modify: `src/app/page.tsx` (landing page)
- Port: `site.config.mjs` → `src/lib/site-config.ts`

**Step 1: Copy landing page components**

Copy all remaining components from the old app to `src/components/`.

**Step 2: Update the landing page route**

Replace `src/app/page.tsx` with the old app's landing page layout — Hero, HowItWorks, Features, PhoneDetector demo section.

The template's landing page redirects authenticated users to `/dashboard`. Keep this behavior but change the redirect target to `/kiosk/create` (or a future dashboard).

**Step 3: Fix Tailwind classes and CSS variables**

Same approach as Task 2 — bridge old CSS variables into the template's `globals.css`.

**Step 4: Port site.config**

Copy `site.config.mjs` to `src/lib/site-config.ts` (convert to TypeScript). Update components that reference it.

**Step 5: Verify full landing page renders**

```bash
npm run dev
```

Navigate to `/`, verify the full landing page renders with Hero, Features, HowItWorks, and PhoneDetector demo.

**Step 6: Commit**

```bash
git add src/components/ src/app/page.tsx src/lib/site-config.ts
git commit -m "feat: port landing page components and site config"
```

---

### Task 4: Port and Adapt Tests

**Files:**
- Create: `src/test/components/PhoneDetector.test.tsx`
- Create: `src/test/lib/alarm-themes.test.ts`
- Adapt: existing `__tests__/` Jest tests to Vitest syntax

**Step 1: Convert key tests from Jest to Vitest**

The main differences:
- Replace `jest.fn()` → `vi.fn()`
- Replace `jest.mock()` → `vi.mock()`
- Replace `jest.spyOn()` → `vi.spyOn()`
- Import `describe, it, expect, vi` from `vitest`
- `beforeEach(() => jest.clearAllMocks())` → `beforeEach(() => vi.clearAllMocks())`

Port the most important tests first:
1. PhoneDetector render/interaction tests
2. Alarm themes unit tests
3. useAlarmSound hook tests

**Step 2: Run tests**

```bash
npm run test
```

Fix any failures.

**Step 3: Commit**

```bash
git add src/test/
git commit -m "test: port and convert existing tests to Vitest"
```

---

### Task 5: Update Middleware for Public Routes

**Files:**
- Modify: `src/lib/supabase/middleware.ts`

**Step 1: Add phone-lunk-alarm public routes**

The template's middleware redirects unauthenticated users to `/login` for non-public routes. We need several routes to be public:

```typescript
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/auth/callback',
  '/api/health',
  '/join',          // members join via QR code — no auth required
  '/badge',         // embeddable badge — no auth
  '/kiosk',         // kiosk display — no auth (runs on gym TV)
]
```

The kiosk display (`/kiosk/[roomId]`) and join page (`/join/[roomId]`) must be public — gym members scan a QR code without logging in. Only kiosk *creation* (`/kiosk/create`) should require auth.

**Step 2: Update the middleware to handle kiosk/create auth**

The route protection logic: `/kiosk/create` requires auth. `/kiosk/[anything-else]` is public.

Update `isPublicRoute`:

```typescript
function isPublicRoute(pathname: string): boolean {
  // /kiosk/create requires auth, but /kiosk/* (display) is public
  if (pathname === '/kiosk/create') return false

  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
}
```

**Step 3: Update Permissions-Policy for camera**

The template's security headers block camera access: `camera=()`. Phone detection needs the camera. Update in both `middleware.ts` and `next.config.ts`:

```typescript
// Change from:
'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
// To:
'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()'
```

**Step 4: Verify middleware works**

```bash
npm run dev
```

- Visit `/` — landing page loads (public)
- Visit `/kiosk/create` — redirects to `/login` (protected)
- Visit `/login` — login page loads
- Visit `/kiosk/TEST01` — would load kiosk display (public, 404 for now is fine)

**Step 5: Commit**

```bash
git add src/lib/supabase/middleware.ts next.config.ts
git commit -m "feat: configure public routes for kiosk, join, and badge pages"
```

---

## Phase 2: Database & Room Infrastructure

### Task 6: Database Migrations for Rooms

**Files:**
- Modify: `supabase/migrations/00001_initial_schema.sql` (already has profiles)
- Create: `supabase/migrations/00002_rooms.sql`

**Step 1: Create rooms migration**

Create `supabase/migrations/00002_rooms.sql`:

```sql
-- Kiosk rooms
CREATE TABLE public.rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily detection counts per room
CREATE TABLE public.daily_counts (
  room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (room_id, date)
);

-- RLS for rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_counts ENABLE ROW LEVEL SECURITY;

-- Anyone can read rooms (needed for join page and badge)
CREATE POLICY "Rooms are publicly readable"
  ON public.rooms FOR SELECT USING (true);

-- Authenticated users can create rooms
CREATE POLICY "Authenticated users can create rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can delete their rooms
CREATE POLICY "Owners can delete their rooms"
  ON public.rooms FOR DELETE
  USING (auth.uid() = owner_id);

-- Anyone can read daily counts (needed for badge)
CREATE POLICY "Daily counts are publicly readable"
  ON public.daily_counts FOR SELECT USING (true);

-- Anyone can upsert daily counts (members increment via anon key)
CREATE POLICY "Anyone can insert daily counts"
  ON public.daily_counts FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update daily counts"
  ON public.daily_counts FOR UPDATE USING (true);

-- Atomic increment function
CREATE OR REPLACE FUNCTION public.increment_daily_count(p_room_id TEXT, p_date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.daily_counts (room_id, date, count)
  VALUES (p_room_id, p_date, 1)
  ON CONFLICT (room_id, date)
  DO UPDATE SET count = public.daily_counts.count + 1;
END;
$$;
```

**Step 2: Commit**

```bash
git add supabase/migrations/00002_rooms.sql
git commit -m "feat: add database migration for rooms and daily counts"
```

**Note:** Run via Supabase dashboard SQL editor or `supabase db push` after setting up the Supabase project.

---

### Task 7: Room Management Library

**Files:**
- Create: `src/lib/rooms.ts`
- Create: `src/test/lib/rooms.test.ts`

**Step 1: Write the failing tests**

Create `src/test/lib/rooms.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { generateRoomCode } from '@/lib/rooms'

describe('generateRoomCode', () => {
  it('returns a 6-character string', () => {
    const code = generateRoomCode()
    expect(code).toHaveLength(6)
  })

  it('only contains unambiguous characters (no I/O/0/1)', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateRoomCode()
      expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/)
    }
  })

  it('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateRoomCode()))
    expect(codes.size).toBe(50)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- rooms`
Expected: FAIL — module not found

**Step 3: Write the room management library**

Create `src/lib/rooms.ts`:

```typescript
import { createClient } from '@/lib/supabase/client'

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]
  }
  return code
}

export interface Room {
  id: string
  name: string
  owner_id: string
  created_at: string
}

/** Create a room (client-side, requires authenticated user) */
export async function createRoom(name: string, ownerId: string): Promise<Room> {
  const supabase = createClient()
  const id = generateRoomCode()

  const { data, error } = await supabase
    .from('rooms')
    .insert({ id, name, owner_id: ownerId })
    .select()
    .single()

  if (error) throw error
  return data as Room
}

/** Get room by ID (public, no auth needed) */
export async function getRoom(roomId: string): Promise<Room | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('id, name, owner_id, created_at')
    .eq('id', roomId.toUpperCase())
    .single()

  if (error) return null
  return data as Room
}

/** Get today's detection count for a room (public) */
export async function getDailyCount(roomId: string): Promise<number> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_counts')
    .select('count')
    .eq('room_id', roomId)
    .eq('date', today)
    .single()

  return data?.count ?? 0
}

/** Increment today's detection count (called by members on detection) */
export async function incrementDailyCount(roomId: string): Promise<void> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase.rpc('increment_daily_count', {
    p_room_id: roomId,
    p_date: today,
  })
  if (error) throw error
}
```

**Step 4: Run tests**

Run: `npm test -- rooms`
Expected: PASS (3 tests for generateRoomCode)

**Step 5: Commit**

```bash
git add src/lib/rooms.ts src/test/lib/rooms.test.ts
git commit -m "feat: add room management library with code generation"
```

---

### Task 8: Real-Time Detection Channel Hook

**Files:**
- Create: `src/hooks/useKioskChannel.ts`
- Create: `src/test/hooks/useKioskChannel.test.ts`

**Step 1: Write the failing test**

Create `src/test/hooks/useKioskChannel.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useKioskChannel } from '@/hooks/useKioskChannel'

const mockSend = vi.fn()
const mockSubscribe = vi.fn((cb) => {
  cb('SUBSCRIBED')
  return mockChannel
})
const mockUnsubscribe = vi.fn()
const mockOn = vi.fn(() => mockChannel)
const mockChannel = {
  on: mockOn,
  subscribe: mockSubscribe,
  unsubscribe: mockUnsubscribe,
  send: mockSend,
  presenceState: vi.fn(() => ({})),
}

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    channel: vi.fn(() => mockChannel),
  }),
}))

describe('useKioskChannel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('subscribes to the room channel on mount', () => {
    const { unmount } = renderHook(() =>
      useKioskChannel({ roomId: 'TEST01' })
    )
    expect(mockSubscribe).toHaveBeenCalled()
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('broadcastDetection sends a detection event', () => {
    const { result } = renderHook(() =>
      useKioskChannel({ roomId: 'TEST01' })
    )
    act(() => {
      result.current.broadcastDetection()
    })
    expect(mockSend).toHaveBeenCalledWith({
      type: 'broadcast',
      event: 'detection',
      payload: expect.objectContaining({
        timestamp: expect.any(String),
      }),
    })
  })
})
```

**Step 2: Run tests to verify failure**

Run: `npm test -- useKioskChannel`
Expected: FAIL

**Step 3: Write the hook**

Create `src/hooks/useKioskChannel.ts`:

```typescript
import { useEffect, useRef, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface DetectionEvent {
  timestamp: string
  memberId: string
}

interface UseKioskChannelOptions {
  roomId: string
  onDetection?: (event: DetectionEvent) => void
}

export function useKioskChannel({ roomId, onDetection }: UseKioskChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const onDetectionRef = useRef(onDetection)
  const [isConnected, setIsConnected] = useState(false)
  const [memberCount, setMemberCount] = useState(0)

  useEffect(() => {
    onDetectionRef.current = onDetection
  }, [onDetection])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: crypto.randomUUID() } },
    })

    channel
      .on('broadcast', { event: 'detection' }, ({ payload }) => {
        onDetectionRef.current?.(payload as DetectionEvent)
      })
      .on('presence', { event: 'sync' }, () => {
        setMemberCount(Object.keys(channel.presenceState()).length)
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel
    return () => { channel.unsubscribe() }
  }, [roomId])

  const broadcastDetection = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'detection',
      payload: {
        timestamp: new Date().toISOString(),
        memberId: 'anon',
      },
    })
  }, [])

  return { isConnected, memberCount, broadcastDetection }
}
```

**Step 4: Run tests**

Run: `npm test -- useKioskChannel`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useKioskChannel.ts src/test/hooks/useKioskChannel.test.ts
git commit -m "feat: add useKioskChannel hook for real-time detection relay"
```

---

## Phase 3: Feature Pages

### Task 9: Add `onDetection` Callback to PhoneDetector

**Files:**
- Modify: `src/components/PhoneDetector.tsx`

**Step 1: Add optional prop**

Add an `onDetection?: () => void` prop to the component. Store in a ref. Call `onDetectionRef.current?.()` in the detection handler right after `playSound()`.

**Step 2: Verify existing tests still pass**

Run: `npm test`
Expected: All pass

**Step 3: Commit**

```bash
git add src/components/PhoneDetector.tsx
git commit -m "feat: add onDetection callback prop to PhoneDetector"
```

---

### Task 10: Kiosk Create Page

**Files:**
- Create: `src/app/kiosk/create/page.tsx`

**Step 1: Build the page**

This page requires auth (middleware handles redirect). On submit:
1. Get current user from Supabase
2. Call `createRoom(name, user.id)`
3. Redirect to `/kiosk/[roomId]`

Simple form: gym name input + create button. Use the template's styling conventions (oklch colors, `cn()` utility).

**Step 2: Verify**

```bash
npm run dev
```

- Visit `/kiosk/create` unauthenticated → redirects to `/login`
- Log in → visit `/kiosk/create` → form renders
- Submit → creates room → redirects to `/kiosk/<code>`

**Step 3: Commit**

```bash
git add src/app/kiosk/create/page.tsx
git commit -m "feat: add kiosk create page (auth required)"
```

---

### Task 11: Kiosk Display Page

**Files:**
- Create: `src/app/kiosk/[roomId]/page.tsx`
- Create: `src/components/KioskDisplay.tsx`

This is the largest task — the full-screen display for gym TVs.

**Step 1: Build KioskDisplay component**

The component:
- Loads room info via `getRoom(roomId)` on mount
- Subscribes to real-time channel via `useKioskChannel` with `onDetection` callback
- Shows a QR code (`QRCodeSVG` from `qrcode.react`) pointing to `/join/[roomId]`
- Displays gym name, session counter, recent catches feed (last 10)
- Triggers `AlarmEffect` + `useAlarmSound` on each detection
- Auto-dismisses alarm after 5 seconds
- Full-screen layout: no header/footer, large bold text
- "All clear" ambient state when idle
- Auto-reconnect on WebSocket drop (handled by Supabase client)

**Step 2: Create the route page**

Create `src/app/kiosk/[roomId]/page.tsx`:

```tsx
import KioskDisplay from '@/components/KioskDisplay'

export default async function KioskPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  return <KioskDisplay roomId={roomId} />
}
```

**Step 3: Create a custom layout to strip the default layout**

Create `src/app/kiosk/[roomId]/layout.tsx` that provides a minimal HTML shell without the standard header/nav.

**Step 4: Manual test**

Create a room, visit the kiosk URL. Verify: full-screen, QR code, gym name, ambient state.

**Step 5: Commit**

```bash
git add src/app/kiosk/[roomId]/ src/components/KioskDisplay.tsx
git commit -m "feat: add kiosk display page with QR code and real-time feed"
```

---

### Task 12: Join Page

**Files:**
- Create: `src/app/join/[roomId]/page.tsx`

**Step 1: Build the join page**

This page is public (no auth). It:
1. Reads `roomId` from params
2. Loads room info via `getRoom(roomId)` — shows gym name
3. Renders `PhoneDetector` with `onDetection` callback
4. On detection: calls `broadcastDetection()` (from `useKioskChannel`) + `incrementDailyCount(roomId)`
5. Shows a "connected" indicator and gym name above the detector

**Step 2: Create a layout that strips default nav**

The join page should be clean — just the gym name, connection status, and the detector. Create `src/app/join/[roomId]/layout.tsx` with minimal chrome.

**Step 3: Manual test**

Open kiosk display in one browser tab. Open join page in another (or on phone via QR code). Detect a phone on the join page → verify it appears on the kiosk display.

**Step 4: Commit**

```bash
git add src/app/join/[roomId]/
git commit -m "feat: add join page for members to connect to kiosk rooms"
```

---

### Task 13: Embeddable Badge

**Files:**
- Create: `src/app/badge/[roomId]/page.tsx`
- Create: `src/app/badge/[roomId]/layout.tsx`
- Create: `public/badge.js`

**Step 1: Build the badge page**

A minimal page designed to render inside an iframe (~240x60px):
- Shows "Phone Lunk Protected" with a small logo
- If room exists and has daily count data, shows "N phones caught today"
- If no room data, shows static badge linking to the app
- Query params: `?theme=dark|light` and `?style=horizontal|vertical`
- Entire badge is a clickable link to `phone-lunk.app/join/[roomId]`

**Step 2: Create badge layout**

`src/app/badge/[roomId]/layout.tsx` — bare HTML shell, no root layout chrome. Override `X-Frame-Options` to `ALLOWALL` for this route so it can be embedded in iframes.

**Step 3: Build the embed script**

Create `public/badge.js`:

```javascript
;(function () {
  var s = document.currentScript
  var gym = s.getAttribute('data-gym') || ''
  var theme = s.getAttribute('data-theme') || 'dark'
  var style = s.getAttribute('data-style') || 'horizontal'
  var f = document.createElement('iframe')
  f.src = 'https://phone-lunk.app/badge/' + gym + '?theme=' + theme + '&style=' + style
  f.style.border = 'none'
  f.style.overflow = 'hidden'
  f.width = style === 'vertical' ? '120' : '240'
  f.height = style === 'vertical' ? '140' : '60'
  s.parentNode.insertBefore(f, s)
})()
```

**Step 4: Commit**

```bash
git add src/app/badge/ public/badge.js
git commit -m "feat: add embeddable badge widget for gym websites"
```

---

## Phase 4: Polish & Ship

### Task 14: Update Navigation

**Files:**
- Modify: `src/components/Header.tsx` (or equivalent nav component)

**Step 1: Add kiosk link**

Add a "Create Kiosk" link to the main navigation pointing to `/kiosk/create`.

**Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add kiosk link to site navigation"
```

---

### Task 15: Full Validation & CI Fix

**Step 1: Run all checks**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

**Step 2: Fix any errors**

Address lint errors, type errors, test failures, and build issues.

**Step 3: Run E2E tests**

```bash
npm run test:e2e
```

Add basic smoke tests for new routes if needed.

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: resolve lint, type, and test issues from integration"
```

---

## Summary

| Phase | Task | What | Effort |
|-------|------|------|--------|
| 1 | 1 | Bootstrap from template | Large |
| 1 | 2 | Port phone detection components | Medium |
| 1 | 3 | Port landing page components | Medium |
| 1 | 4 | Port and convert tests to Vitest | Medium |
| 1 | 5 | Update middleware for public routes | Small |
| 2 | 6 | Database migrations for rooms | Small |
| 2 | 7 | Room management library | Medium |
| 2 | 8 | Real-time channel hook | Medium |
| 3 | 9 | PhoneDetector onDetection callback | Small |
| 3 | 10 | Kiosk create page | Medium |
| 3 | 11 | Kiosk display page | Large |
| 3 | 12 | Join page | Medium |
| 3 | 13 | Embeddable badge | Medium |
| 4 | 14 | Update navigation | Small |
| 4 | 15 | Full validation & CI fix | Medium |

**Dependencies:**
- Phase 1 (Tasks 1-5) must complete before Phase 2
- Phase 2 (Tasks 6-8) must complete before Phase 3
- Tasks within each phase can be done sequentially
- Phase 4 is cleanup after features work

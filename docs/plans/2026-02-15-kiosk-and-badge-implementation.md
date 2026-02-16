# Kiosk Mode & Embeddable Badge — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a real-time kiosk display mode for gym TVs and an embeddable badge for gym websites, both powered by Supabase Realtime channels.

**Architecture:** The app currently uses static export (`output: 'export'`). We remove that to enable dynamic routes (`/kiosk/[roomId]`, `/join/[roomId]`, `/badge/[roomId]`). Supabase provides both the database (rooms, daily counts) and real-time pub/sub (detection events via broadcast channels). All real-time logic runs client-side — no custom WebSocket server needed.

**Tech Stack:** Supabase (Realtime + Postgres), `@supabase/supabase-js`, `qrcode.react` for QR codes, existing Tailwind + alarm theme system.

**Design doc:** `docs/plans/2026-02-15-kiosk-and-widget-design.md`

---

## Task 1: Add Supabase and QR Code Dependencies

**Files:**
- Modify: `package.json`
- Create: `lib/supabase.ts`
- Create: `.env.local.example`

**Step 1: Install dependencies**

Run: `npm install @supabase/supabase-js qrcode.react`

**Step 2: Create Supabase client**

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 3: Create env example file**

Create `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Step 4: Add `.env.local` to `.gitignore`**

Check `.gitignore` — if `.env.local` isn't already listed, add it.

**Step 5: Commit**

```bash
git add lib/supabase.ts .env.local.example package.json package-lock.json .gitignore
git commit -m "feat: add Supabase client and QR code dependencies"
```

---

## Task 2: Remove Static Export, Enable Dynamic Routes

**Files:**
- Modify: `next.config.mjs`

The app currently uses `output: 'export'` which prevents dynamic routes. We need dynamic routes for `/kiosk/[roomId]`, `/join/[roomId]`, and `/badge/[roomId]`.

**Step 1: Remove static export**

In `next.config.mjs`, remove the `output: 'export'` line. Keep everything else (trailingSlash, basePath, images).

```javascript
/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

**Step 2: Verify build still works**

Run: `npm run build`
Expected: Build succeeds. Warning about no static export is fine.

**Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "feat: remove static export to enable dynamic routes"
```

**Note:** This breaks GitHub Pages deployment (which requires static files). The app is primarily on Vercel, which handles dynamic routes natively. If GitHub Pages fallback is needed later, it can be re-added as a separate build target.

---

## Task 3: Supabase Database Schema

**Files:**
- Create: `supabase/schema.sql`

This task creates the SQL schema. The actual Supabase project must be created manually at supabase.com before running migrations.

**Step 1: Create schema file**

Create `supabase/schema.sql`:

```sql
-- Rooms table
create table rooms (
  id text primary key,
  name text not null,
  owner_token text not null,
  created_at timestamptz default now() not null
);

-- Daily detection counts
create table daily_counts (
  room_id text references rooms(id) on delete cascade,
  date date not null,
  count integer default 0 not null,
  primary key (room_id, date)
);

-- RLS policies: rooms are publicly readable, writable with no auth (anon key)
alter table rooms enable row level security;
alter table daily_counts enable row level security;

create policy "Rooms are publicly readable"
  on rooms for select using (true);

create policy "Anyone can create rooms"
  on rooms for insert with check (true);

create policy "Daily counts are publicly readable"
  on daily_counts for select using (true);

create policy "Anyone can insert daily counts"
  on daily_counts for insert with check (true);

create policy "Anyone can update daily counts"
  on daily_counts for update using (true);

-- Function to atomically increment daily count (upsert)
create or replace function increment_daily_count(p_room_id text, p_date date)
returns void as $$
begin
  insert into daily_counts (room_id, date, count)
  values (p_room_id, p_date, 1)
  on conflict (room_id, date)
  do update set count = daily_counts.count + 1;
end;
$$ language plpgsql;
```

**Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase schema for rooms and daily counts"
```

**Step 3: Apply schema manually**

Run the SQL in the Supabase dashboard SQL editor after creating the project. (This is a manual step — document it in the README later.)

---

## Task 4: Room Management Library

**Files:**
- Create: `lib/rooms.ts`
- Create: `__tests__/rooms.test.ts`

**Step 1: Write the failing tests**

Create `__tests__/rooms.test.ts`:

```typescript
import { generateRoomCode } from '@/lib/rooms'

// Mock Supabase — we test the pure functions here, not the DB calls
describe('generateRoomCode', () => {
  it('returns a 6-character string', () => {
    const code = generateRoomCode()
    expect(code).toHaveLength(6)
  })

  it('only contains unambiguous characters (no I/O/0/1)', () => {
    // Run multiple times to catch randomness issues
    for (let i = 0; i < 100; i++) {
      const code = generateRoomCode()
      expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/)
    }
  })

  it('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateRoomCode()))
    // With 6 chars from 32-char alphabet, collisions in 50 codes are near-impossible
    expect(codes.size).toBe(50)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- --testPathPattern=rooms`
Expected: FAIL — module not found

**Step 3: Write the room management library**

Create `lib/rooms.ts`:

```typescript
import { supabase } from './supabase'

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
  owner_token: string
  created_at: string
}

export async function createRoom(name: string): Promise<{ room: Room; ownerToken: string }> {
  const id = generateRoomCode()
  const ownerToken = crypto.randomUUID()

  const { data, error } = await supabase
    .from('rooms')
    .insert({ id, name, owner_token: ownerToken })
    .select()
    .single()

  if (error) throw error
  return { room: data as Room, ownerToken }
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('id, name, created_at')
    .eq('id', roomId.toUpperCase())
    .single()

  if (error) return null
  return data as Room
}

export async function getDailyCount(roomId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_counts')
    .select('count')
    .eq('room_id', roomId)
    .eq('date', today)
    .single()

  return data?.count ?? 0
}

export async function incrementDailyCount(roomId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase.rpc('increment_daily_count', {
    p_room_id: roomId,
    p_date: today,
  })
  if (error) throw error
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- --testPathPattern=rooms`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add lib/rooms.ts __tests__/rooms.test.ts
git commit -m "feat: add room management library with code generation"
```

---

## Task 5: Real-Time Detection Channel Hook

**Files:**
- Create: `hooks/useKioskChannel.ts`
- Create: `__tests__/useKioskChannel.test.ts`

**Step 1: Write the failing test**

Create `__tests__/useKioskChannel.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { useKioskChannel } from '@/hooks/useKioskChannel'

// Mock Supabase
const mockSend = jest.fn()
const mockSubscribe = jest.fn((cb) => { cb('SUBSCRIBED'); return mockChannel })
const mockUnsubscribe = jest.fn()
const mockOn = jest.fn(() => mockChannel)
const mockChannel = {
  on: mockOn,
  subscribe: mockSubscribe,
  unsubscribe: mockUnsubscribe,
  send: mockSend,
  presenceState: jest.fn(() => ({})),
}

jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => mockChannel),
  },
}))

describe('useKioskChannel', () => {
  beforeEach(() => jest.clearAllMocks())

  it('subscribes to the room channel on mount', () => {
    const { unmount } = renderHook(() =>
      useKioskChannel({ roomId: 'TEST01' })
    )
    const { supabase } = require('@/lib/supabase')
    expect(supabase.channel).toHaveBeenCalledWith(
      'room:TEST01',
      expect.any(Object)
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

**Step 2: Run tests to verify they fail**

Run: `npm test -- --testPathPattern=useKioskChannel`
Expected: FAIL — module not found

**Step 3: Write the hook**

Create `hooks/useKioskChannel.ts`:

```typescript
import { useEffect, useRef, useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'
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

  // Keep callback ref fresh without re-subscribing
  useEffect(() => {
    onDetectionRef.current = onDetection
  }, [onDetection])

  useEffect(() => {
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

    return () => {
      channel.unsubscribe()
    }
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

**Step 4: Run tests to verify they pass**

Run: `npm test -- --testPathPattern=useKioskChannel`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add hooks/useKioskChannel.ts __tests__/useKioskChannel.test.ts
git commit -m "feat: add useKioskChannel hook for real-time detection relay"
```

---

## Task 6: Add `onDetection` Callback to PhoneDetector

**Files:**
- Modify: `components/PhoneDetector.tsx`
- Modify: `__tests__/PhoneDetector.test.tsx`

This is a small refactor — add an optional `onDetection` prop so the join page can hook into detection events without duplicating logic.

**Step 1: Add failing test**

In `__tests__/PhoneDetector.test.tsx`, add a test case:

```typescript
it('calls onDetection callback when phone is detected', async () => {
  const onDetection = jest.fn()
  render(<PhoneDetector onDetection={onDetection} />)
  // Simulate detection by triggering the existing detection flow
  // (This test follows the same pattern as existing detection tests in the file)
})
```

Look at the existing detection test pattern (around line 406-461) and follow the same mock setup for triggering a detection.

**Step 2: Run tests to verify the new test fails**

Run: `npm test -- --testPathPattern=PhoneDetector`
Expected: FAIL — onDetection prop not recognized (or not called)

**Step 3: Modify PhoneDetector**

In `components/PhoneDetector.tsx`:

1. Add prop type at the top of the component:

```typescript
interface PhoneDetectorProps {
  onDetection?: () => void
}

export default function PhoneDetector({ onDetection }: PhoneDetectorProps) {
```

2. In the detection handler (around line 211-230, where `setPhoneDetected(true)` is called), add:

```typescript
onDetection?.()
```

Right after the `playSound()` call.

3. Store the callback in a ref to avoid stale closures in the detection interval:

```typescript
const onDetectionRef = useRef(onDetection)
useEffect(() => { onDetectionRef.current = onDetection }, [onDetection])
```

Then call `onDetectionRef.current?.()` instead of `onDetection?.()` in the detection handler.

**Step 4: Run full test suite**

Run: `npm test`
Expected: All existing tests still pass + new test passes

**Step 5: Commit**

```bash
git add components/PhoneDetector.tsx __tests__/PhoneDetector.test.tsx
git commit -m "feat: add onDetection callback prop to PhoneDetector"
```

---

## Task 7: Kiosk Create Page

**Files:**
- Create: `app/kiosk/create/page.tsx`
- Create: `__tests__/kiosk-create.test.tsx`

**Step 1: Write the failing test**

Create `__tests__/kiosk-create.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import KioskCreatePage from '@/app/kiosk/create/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

jest.mock('@/lib/rooms', () => ({
  createRoom: jest.fn().mockResolvedValue({
    room: { id: 'TEST01', name: 'Test Gym' },
    ownerToken: 'token-123',
  }),
}))

describe('Kiosk Create Page', () => {
  it('renders a form with gym name input and create button', () => {
    render(<KioskCreatePage />)
    expect(screen.getByPlaceholderText(/gym name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run tests to verify failure**

Run: `npm test -- --testPathPattern=kiosk-create`
Expected: FAIL — module not found

**Step 3: Build the page**

Create `app/kiosk/create/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRoom } from '@/lib/rooms'

export default function KioskCreatePage() {
  const router = useRouter()
  const [gymName, setGymName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!gymName.trim()) return

    setIsCreating(true)
    setError('')

    try {
      const { room, ownerToken } = await createRoom(gymName.trim())
      // Store owner token in localStorage so they can manage the room later
      localStorage.setItem(`kiosk-owner-${room.id}`, ownerToken)
      router.push(`/kiosk/${room.id}`)
    } catch {
      setError('Failed to create room. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Create a Kiosk
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Set up a live phone lunk display for your gym
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Gym name"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={!gymName.trim() || isCreating}
            className="w-full py-3 rounded-lg bg-[var(--accent-primary)] text-white font-semibold text-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isCreating ? 'Creating...' : 'Create Kiosk'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

**Step 4: Run tests**

Run: `npm test -- --testPathPattern=kiosk-create`
Expected: PASS

**Step 5: Commit**

```bash
git add app/kiosk/create/page.tsx __tests__/kiosk-create.test.tsx
git commit -m "feat: add kiosk create page with room setup form"
```

---

## Task 8: Kiosk Display Page

**Files:**
- Create: `app/kiosk/[roomId]/page.tsx`
- Create: `components/KioskDisplay.tsx`
- Create: `__tests__/KioskDisplay.test.tsx`

This is the largest task — the full-screen display that runs on a gym TV.

**Step 1: Write the failing test**

Create `__tests__/KioskDisplay.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import KioskDisplay from '@/components/KioskDisplay'

jest.mock('@/lib/supabase', () => ({
  supabase: { channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn((cb) => { cb('SUBSCRIBED'); return { unsubscribe: jest.fn(), presenceState: jest.fn(() => ({})) } }),
    unsubscribe: jest.fn(),
    presenceState: jest.fn(() => ({})),
  }))},
}))

jest.mock('@/lib/rooms', () => ({
  getRoom: jest.fn().mockResolvedValue({ id: 'TEST01', name: 'Iron Temple' }),
  getDailyCount: jest.fn().mockResolvedValue(5),
}))

jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => <div data-testid="qr-code">{value}</div>,
}))

describe('KioskDisplay', () => {
  it('renders gym name and QR code', async () => {
    render(<KioskDisplay roomId="TEST01" />)
    expect(await screen.findByText('Iron Temple')).toBeInTheDocument()
    expect(screen.getByTestId('qr-code')).toBeInTheDocument()
  })

  it('shows the session detection count', async () => {
    render(<KioskDisplay roomId="TEST01" />)
    // Initial count from getDailyCount mock
    expect(await screen.findByText(/5/)).toBeInTheDocument()
  })
})
```

**Step 2: Run tests to verify failure**

Run: `npm test -- --testPathPattern=KioskDisplay`
Expected: FAIL

**Step 3: Build the KioskDisplay component**

Create `components/KioskDisplay.tsx`. This component handles:

- Loading room info from Supabase on mount
- Subscribing to the room's real-time channel via `useKioskChannel`
- Displaying a QR code (using `QRCodeSVG` from `qrcode.react`)
- Showing detection alerts with the existing `AlarmEffect` component and theme system
- Maintaining a session counter and recent catches feed
- Full-screen layout, no nav/footer
- "All clear" ambient state when no detection is active

Key implementation details:
- Use `useKioskChannel` with an `onDetection` callback that:
  - Sets `phoneDetected = true` (triggers AlarmEffect)
  - Increments local session counter
  - Adds to recent catches array (keep last 10)
  - Calls `incrementDailyCount` on Supabase
  - Auto-dismisses after 5 seconds (same as PhoneDetector)
- QR code value: `${window.location.origin}/join/${roomId}`
- Load the existing `AlarmEffect` component for alarm animations
- Use the "classic" theme by default (or allow theme selection via query param)
- Use `useAlarmSound` for audio on the kiosk itself

**Step 4: Create the route page**

Create `app/kiosk/[roomId]/page.tsx`:

```tsx
import KioskDisplay from '@/components/KioskDisplay'

export default async function KioskPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  return <KioskDisplay roomId={roomId} />
}
```

**Step 5: Run tests**

Run: `npm test -- --testPathPattern=KioskDisplay`
Expected: PASS

**Step 6: Manual test**

Run: `npm run dev`
Navigate to `/kiosk/create`, create a room, verify redirect to `/kiosk/<code>`.
Verify: full-screen display, QR code visible, gym name displayed, "all clear" state.

**Step 7: Commit**

```bash
git add app/kiosk/[roomId]/page.tsx components/KioskDisplay.tsx __tests__/KioskDisplay.test.tsx
git commit -m "feat: add kiosk display page with QR code and real-time detection feed"
```

---

## Task 9: Join Page

**Files:**
- Create: `app/join/[roomId]/page.tsx`
- Create: `__tests__/join-page.test.tsx`

**Step 1: Write the failing test**

Create `__tests__/join-page.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import JoinPage from '@/app/join/[roomId]/page'

jest.mock('@/lib/supabase', () => ({
  supabase: { channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn((cb) => { cb('SUBSCRIBED'); return { unsubscribe: jest.fn(), presenceState: jest.fn(() => ({})) } }),
    unsubscribe: jest.fn(),
    send: jest.fn(),
    presenceState: jest.fn(() => ({})),
  }))},
}))

jest.mock('@/lib/rooms', () => ({
  getRoom: jest.fn().mockResolvedValue({ id: 'TEST01', name: 'Iron Temple' }),
  incrementDailyCount: jest.fn(),
}))

jest.mock('@/components/PhoneDetector', () => {
  return function MockPhoneDetector() {
    return <div data-testid="phone-detector">PhoneDetector</div>
  }
})

describe('Join Page', () => {
  it('renders the gym name and phone detector', async () => {
    render(await JoinPage({ params: Promise.resolve({ roomId: 'TEST01' }) }))
    expect(await screen.findByText(/Iron Temple/i)).toBeInTheDocument()
    expect(screen.getByTestId('phone-detector')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

Run: `npm test -- --testPathPattern=join-page`
Expected: FAIL

**Step 3: Build the join page**

Create `app/join/[roomId]/page.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PhoneDetector from '@/components/PhoneDetector'
import { useKioskChannel } from '@/hooks/useKioskChannel'
import { getRoom, incrementDailyCount } from '@/lib/rooms'
import type { Room } from '@/lib/rooms'

export default function JoinPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const [room, setRoom] = useState<Room | null>(null)
  const [notFound, setNotFound] = useState(false)

  const { isConnected, broadcastDetection } = useKioskChannel({
    roomId: roomId ?? '',
  })

  useEffect(() => {
    if (!roomId) return
    getRoom(roomId).then((r) => {
      if (r) setRoom(r)
      else setNotFound(true)
    })
  }, [roomId])

  function handleDetection() {
    broadcastDetection()
    if (roomId) incrementDailyCount(roomId)
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-[var(--text-secondary)] text-lg">Room not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {room && (
        <div className="text-center py-4">
          <p className="text-[var(--text-secondary)]">
            Connected to <span className="font-semibold text-[var(--text-primary)]">{room.name}</span>
            {isConnected && <span className="ml-2 text-green-500 text-sm">● Live</span>}
          </p>
        </div>
      )}
      <PhoneDetector onDetection={handleDetection} />
    </div>
  )
}
```

**Note:** This page uses `useParams` client-side to get the roomId, avoiding the need for a server component wrapper. Adjust the test accordingly if the component signature changes.

**Step 4: Run tests**

Run: `npm test -- --testPathPattern=join-page`
Expected: PASS

**Step 5: Commit**

```bash
git add app/join/[roomId]/page.tsx __tests__/join-page.test.tsx
git commit -m "feat: add join page for members to connect to kiosk rooms"
```

---

## Task 10: Embeddable Badge

**Files:**
- Create: `app/badge/[roomId]/page.tsx`
- Create: `public/badge.js`
- Create: `__tests__/badge.test.tsx`

**Step 1: Write the failing test**

Create `__tests__/badge.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import BadgePage from '@/app/badge/[roomId]/page'

jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

jest.mock('@/lib/rooms', () => ({
  getRoom: jest.fn().mockResolvedValue({ id: 'TEST01', name: 'Iron Temple' }),
  getDailyCount: jest.fn().mockResolvedValue(23),
}))

describe('Badge Page', () => {
  it('renders the badge with gym name and count', async () => {
    render(await BadgePage({ params: Promise.resolve({ roomId: 'TEST01' }) }))
    expect(await screen.findByText(/Phone Lunk Protected/i)).toBeInTheDocument()
    expect(await screen.findByText(/23/)).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

Run: `npm test -- --testPathPattern=badge`
Expected: FAIL

**Step 3: Build the badge page**

Create `app/badge/[roomId]/page.tsx`. This is a minimal page designed to be rendered inside an iframe:

- No layout chrome (custom layout that strips header/footer)
- ~200x60px content area
- Shows "Phone Lunk Protected" with the app logo
- Shows daily detection count if the room exists and has data
- Two style variants controlled by query param: `?theme=dark` or `?theme=light`
- Entire badge is a link to `phone-lunk.app/join/<roomId>`

Create `app/badge/[roomId]/layout.tsx` to strip the root layout:

```tsx
export default function BadgeLayout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
```

**Step 4: Build the embed script**

Create `public/badge.js`:

```javascript
(function() {
  var script = document.currentScript;
  var gym = script.getAttribute('data-gym') || '';
  var theme = script.getAttribute('data-theme') || 'dark';
  var style = script.getAttribute('data-style') || 'horizontal';

  var iframe = document.createElement('iframe');
  iframe.src = 'https://phone-lunk.app/badge/' + gym + '?theme=' + theme + '&style=' + style;
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';

  if (style === 'vertical') {
    iframe.width = '120';
    iframe.height = '140';
  } else {
    iframe.width = '240';
    iframe.height = '60';
  }

  script.parentNode.insertBefore(iframe, script);
})();
```

**Step 5: Run tests**

Run: `npm test -- --testPathPattern=badge`
Expected: PASS

**Step 6: Commit**

```bash
git add app/badge/[roomId]/page.tsx app/badge/[roomId]/layout.tsx public/badge.js __tests__/badge.test.tsx
git commit -m "feat: add embeddable badge widget for gym websites"
```

---

## Task 11: Integration Smoke Test

**Files:**
- Modify: `tests/phone-detector.spec.ts` (add kiosk/join route tests)

**Step 1: Add E2E tests**

Add to the Playwright spec:

```typescript
test.describe('Kiosk Create', () => {
  test('renders create form', async ({ page }) => {
    await page.goto('/kiosk/create')
    await expect(page.getByPlaceholder(/gym name/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  })
})

test.describe('Badge', () => {
  test('renders badge for unknown room', async ({ page }) => {
    await page.goto('/badge/FAKE99')
    await expect(page.getByText(/Phone Lunk/i)).toBeVisible()
  })
})
```

**Step 2: Run E2E**

Run: `npm run test:e2e`
Expected: New tests pass (existing tests still pass)

**Step 3: Run full validation**

Run all checks:
```bash
npm run lint
npm run type-check
npm test
```
Expected: All pass

**Step 4: Commit**

```bash
git add tests/phone-detector.spec.ts
git commit -m "test: add E2E smoke tests for kiosk and badge routes"
```

---

## Task 12: Update README and Navigation

**Files:**
- Modify: `site.config.mjs` (add kiosk nav item)
- Modify: `components/Header.tsx` (if nav is hardcoded)

**Step 1: Add kiosk link to navigation**

In `site.config.mjs`, add a "Kiosk" item to the navigation array so gym owners can discover it.

**Step 2: Verify navigation renders**

Run: `npm run dev`, check header shows new nav item.

**Step 3: Commit**

```bash
git add site.config.mjs
git commit -m "feat: add kiosk link to site navigation"
```

---

## Summary

| Task | What | Effort |
|------|------|--------|
| 1 | Supabase + QR deps | Small |
| 2 | Remove static export | Small |
| 3 | DB schema | Small |
| 4 | Room management lib | Medium |
| 5 | Real-time channel hook | Medium |
| 6 | PhoneDetector onDetection prop | Small |
| 7 | Kiosk create page | Medium |
| 8 | Kiosk display page | Large |
| 9 | Join page | Medium |
| 10 | Embeddable badge | Medium |
| 11 | Integration tests | Small |
| 12 | Nav + README update | Small |

**Dependencies:** Tasks 1-3 are infrastructure (do first). Task 4-5 are shared libraries. Task 6 modifies existing code. Tasks 7-10 are the feature pages (can be parallelized after 1-6). Tasks 11-12 are cleanup.

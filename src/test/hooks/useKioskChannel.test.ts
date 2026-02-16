import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKioskChannel } from '@/hooks/useKioskChannel'

// --- Mock Supabase Realtime channel ---

const mockSend = vi.fn()
const mockUnsubscribe = vi.fn()
const mockPresenceState = vi.fn().mockReturnValue({})

type BroadcastHandler = (msg: { payload: unknown }) => void
type PresenceHandler = () => void
type SubscribeCallback = (status: string) => void

let broadcastHandler: BroadcastHandler | null = null
let presenceHandler: PresenceHandler | null = null
let subscribeCallback: SubscribeCallback | null = null

const mockChannel = {
  on: vi.fn().mockImplementation(function (
    this: typeof mockChannel,
    type: string,
    filter: { event: string },
    handler: BroadcastHandler | PresenceHandler,
  ) {
    if (type === 'broadcast' && filter.event === 'detection') {
      broadcastHandler = handler as BroadcastHandler
    }
    if (type === 'presence' && filter.event === 'sync') {
      presenceHandler = handler as PresenceHandler
    }
    return this
  }),
  subscribe: vi.fn().mockImplementation((cb: SubscribeCallback) => {
    subscribeCallback = cb
  }),
  unsubscribe: mockUnsubscribe,
  send: mockSend,
  presenceState: mockPresenceState,
}

let lastChannelName: string | null = null

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    channel: vi.fn().mockImplementation((name: string) => {
      lastChannelName = name
      return mockChannel
    }),
  }),
}))

// Mock crypto.randomUUID for deterministic tests
vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid-1234' })

describe('useKioskChannel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    broadcastHandler = null
    presenceHandler = null
    subscribeCallback = null
    lastChannelName = null
  })

  it('subscribes to room:<roomId> channel on mount', () => {
    renderHook(() => useKioskChannel({ roomId: 'ABC123' }))

    expect(lastChannelName).toBe('room:ABC123')
    expect(mockChannel.on).toHaveBeenCalledTimes(2)
    expect(mockChannel.subscribe).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useKioskChannel({ roomId: 'ABC123' }))
    unmount()

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })

  it('sets isConnected to true when status is SUBSCRIBED', () => {
    const { result } = renderHook(() => useKioskChannel({ roomId: 'ABC123' }))

    expect(result.current.isConnected).toBe(false)

    act(() => {
      subscribeCallback?.('SUBSCRIBED')
    })

    expect(result.current.isConnected).toBe(true)
  })

  it('broadcastDetection sends detection event with timestamp', () => {
    const { result } = renderHook(() => useKioskChannel({ roomId: 'ABC123' }))

    const before = new Date().toISOString()

    act(() => {
      result.current.broadcastDetection()
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    const sentPayload = mockSend.mock.calls[0][0]
    expect(sentPayload.type).toBe('broadcast')
    expect(sentPayload.event).toBe('detection')
    expect(sentPayload.payload.memberId).toBe('anon')

    // Verify timestamp is a valid ISO string between before and now
    const ts = new Date(sentPayload.payload.timestamp)
    expect(ts.getTime()).toBeGreaterThanOrEqual(new Date(before).getTime())
    expect(ts.getTime()).toBeLessThanOrEqual(Date.now())
  })

  it('calls onDetection callback when broadcast event arrives', () => {
    const onDetection = vi.fn()
    renderHook(() => useKioskChannel({ roomId: 'ABC123', onDetection }))

    const event = { timestamp: '2025-01-01T00:00:00Z', memberId: 'user-1' }
    act(() => {
      broadcastHandler?.({ payload: event })
    })

    expect(onDetection).toHaveBeenCalledWith(event)
  })

  it('updates memberCount on presence sync', () => {
    const { result } = renderHook(() => useKioskChannel({ roomId: 'ABC123' }))

    mockPresenceState.mockReturnValue({ user1: [], user2: [], user3: [] })

    act(() => {
      presenceHandler?.()
    })

    expect(result.current.memberCount).toBe(3)
  })
})

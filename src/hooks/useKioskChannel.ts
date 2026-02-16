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

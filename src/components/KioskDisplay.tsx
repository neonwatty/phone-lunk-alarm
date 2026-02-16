'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'

import { getRoom, getDailyCount } from '@/lib/rooms'
import { useKioskChannel } from '@/hooks/useKioskChannel'
import { useAlarmSound } from '@/hooks/useAlarmSound'
import AlarmEffect from '@/components/AlarmEffect'
import { ALARM_THEMES } from '@/lib/alarm-themes'

interface RecentCatch {
  id: string
  timestamp: Date
}

export default function KioskDisplay({ roomId }: { roomId: string }) {
  const [gymName, setGymName] = useState<string>('')
  const [dailyCount, setDailyCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)
  const [phoneDetected, setPhoneDetected] = useState(false)
  const [recentCatches, setRecentCatches] = useState<RecentCatch[]>([])
  const [loading, setLoading] = useState(true)

  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { playSound, stopSound } = useAlarmSound()

  // Handle detection event
  const handleDetection = useCallback(
    () => {
      setPhoneDetected(true)
      setSessionCount((prev) => prev + 1)
      setDailyCount((prev) => prev + 1)

      const newCatch: RecentCatch = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
      }
      setRecentCatches((prev) => [newCatch, ...prev].slice(0, 10))

      playSound()

      // Clear any existing dismiss timer
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current)
      }

      // Auto-dismiss after 5 seconds
      dismissTimerRef.current = setTimeout(() => {
        setPhoneDetected(false)
        stopSound()
        dismissTimerRef.current = null
      }, 5000)
    },
    [roomId, playSound, stopSound],
  )

  const { isConnected, memberCount } = useKioskChannel({
    roomId,
    onDetection: handleDetection,
  })

  // Load room data on mount
  useEffect(() => {
    async function loadRoom() {
      const room = await getRoom(roomId)
      if (room) {
        setGymName(room.name)
      }

      const count = await getDailyCount(roomId)
      setDailyCount(count)
      setLoading(false)
    }

    loadRoom()
  }, [roomId])

  // Derive QR URL from window.location (safe in 'use client' component)
  const qrUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/join/${roomId}`
    }
    return ''
  }, [roomId])

  // Cleanup dismiss timer
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current)
      }
    }
  }, [])

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
          <p className="mt-4 text-lg text-gray-400">Loading kiosk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      {/* Alarm overlay */}
      <AlarmEffect active={phoneDetected} theme="classic" intensity="high" />

      {/* Phone detected banner */}
      {phoneDetected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="text-center">
            <p
              className="text-8xl font-extrabold tracking-wider animate-pulse md:text-9xl"
              style={{ color: ALARM_THEMES.classic.primary }}
            >
              PHONE DETECTED!
            </p>
          </div>
        </div>
      )}

      {/* Main content - visible in idle state, behind alarm in active state */}
      <div
        className={`flex flex-1 flex-col transition-opacity duration-300 ${
          phoneDetected ? 'opacity-20' : 'opacity-100'
        }`}
      >
        {/* Top bar: connection status + member count */}
        <div className="flex items-center justify-between px-8 pt-6">
          <div className="flex items-center gap-3">
            {/* Connection indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isConnected
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                    : 'bg-red-500 animate-pulse'
                }`}
              />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>
          </div>

          {memberCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              <span>
                {memberCount} {memberCount === 1 ? 'member' : 'members'} watching
              </span>
            </div>
          )}
        </div>

        {/* Center content */}
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="flex w-full max-w-7xl items-start justify-between gap-12">
            {/* Left side: main info */}
            <div className="flex flex-1 flex-col items-center text-center">
              {/* Gym name */}
              <h1 className="mb-8 text-5xl font-bold tracking-tight text-white md:text-7xl">
                {gymName}
              </h1>

              {/* All Clear status */}
              <div className="mb-10 flex items-center gap-4">
                <div className="relative">
                  <div className="h-5 w-5 rounded-full bg-green-500" />
                  <div className="absolute inset-0 h-5 w-5 animate-ping rounded-full bg-green-500 opacity-40" />
                </div>
                <span className="text-4xl font-semibold text-green-400 md:text-5xl">
                  All Clear
                </span>
              </div>

              {/* Session counter */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 px-10 py-6">
                <p className="text-6xl font-extrabold tabular-nums text-white md:text-7xl">
                  {dailyCount}
                </p>
                <p className="mt-2 text-xl text-gray-400">
                  {dailyCount === 1 ? 'phone caught today' : 'phones caught today'}
                </p>
                {sessionCount > 0 && sessionCount !== dailyCount && (
                  <p className="mt-1 text-sm text-gray-500">
                    {sessionCount} this session
                  </p>
                )}
              </div>
            </div>

            {/* Right side: recent catches + QR code */}
            <div className="flex w-72 shrink-0 flex-col items-end gap-8">
              {/* Recent catches feed */}
              {recentCatches.length > 0 && (
                <div className="w-full">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Recent Catches
                  </h2>
                  <div className="space-y-2">
                    {recentCatches.slice(0, 5).map((catchItem) => (
                      <div
                        key={catchItem.id}
                        className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3"
                      >
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-gray-300">
                          Phone detected
                        </span>
                        <span className="ml-auto text-sm tabular-nums text-gray-500">
                          {formatTime(catchItem.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code */}
              {qrUrl && (
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-white p-3">
                    <QRCodeSVG value={qrUrl} size={160} level="M" />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">Scan to join</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Room code footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-sm text-gray-600">
            Room Code: <span className="font-mono font-semibold text-gray-400">{roomId}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

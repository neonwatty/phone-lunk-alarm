'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

import { getRoom, incrementDailyCount } from '@/lib/rooms'
import { useKioskChannel } from '@/hooks/useKioskChannel'
import PhoneDetector from '@/components/PhoneDetector'

export default function JoinPage() {
  const params = useParams<{ roomId: string }>()
  const roomId = params.roomId

  const [gymName, setGymName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const { broadcastDetection, isConnected } = useKioskChannel({ roomId })

  // Load room data on mount
  useEffect(() => {
    async function loadRoom() {
      const room = await getRoom(roomId)
      if (room) {
        setGymName(room.name)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }

    loadRoom()
  }, [roomId])

  const handleDetection = useCallback(() => {
    broadcastDetection()
    incrementDailyCount(roomId).catch(console.error)
  }, [broadcastDetection, roomId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
          <p className="mt-4 text-gray-400">Connecting to room...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">&#x1F6AB;</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Room Not Found</h1>
          <p className="text-gray-400">
            The room code <span className="font-mono font-semibold text-gray-300">{roomId}</span> does not exist.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Check the QR code and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Gym name banner + connection status */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-xl font-bold text-white">{gymName}</h1>
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected
                  ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]'
                  : 'bg-red-500 animate-pulse'
              }`}
            />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Phone detector */}
      <div className="flex-1">
        <PhoneDetector onDetection={handleDetection} />
      </div>
    </div>
  )
}

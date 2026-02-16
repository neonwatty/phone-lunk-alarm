'use client'

import { useState, useEffect } from 'react'

// Rotating example GIFs - compressed and optimized
const EXAMPLE_GIFS = [
  '/images/examples/phone-lunk-1.gif',
  '/images/examples/phone-lunk-2.gif',
  '/images/examples/phone-lunk-3.gif'
] as const

const GIF_DISPLAY_DURATION = 5000 // 5 seconds per GIF
const TRANSITION_DURATION = 300 // 300ms crossfade

export default function VideoMockup() {
  const [alarmActive, setAlarmActive] = useState(false)
  const [currentGifIndex, setCurrentGifIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Simulate phone detection for demo purposes - synced with GIF timing
  useEffect(() => {
    // Trigger phone alarm every 4 seconds (better synced with GIF loop)
    const interval = setInterval(() => {
      setAlarmActive(true)
      setTimeout(() => setAlarmActive(false), 2500) // Alarm lasts 2.5 seconds
    }, 4000) // Trigger every 4 seconds

    return () => clearInterval(interval)
  }, [])

  // Rotate through example GIFs automatically
  useEffect(() => {
    // Preload all GIFs for smooth transitions
    EXAMPLE_GIFS.forEach(gif => {
      const img = new Image()
      img.src = gif
    })

    // Set up rotation interval
    const rotationInterval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentGifIndex((prev) => (prev + 1) % EXAMPLE_GIFS.length)
        setIsTransitioning(false)
      }, TRANSITION_DURATION)
    }, GIF_DISPLAY_DURATION)

    return () => clearInterval(rotationInterval)
  }, [])

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-12">
      {/* Main mockup container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Simulated camera feed with GIF */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* Rotating gym phone GIFs - automatically cycles through examples */}
          <img
            src={EXAMPLE_GIFS[currentGifIndex]}
            alt={`Phone Lunk example ${currentGifIndex + 1} - Person on phone in gym`}
            className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Detection overlays */}
          <>
            {/* Warning banner - always visible */}
            <div className="absolute top-1 sm:top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-red-600 text-white px-1.5 py-0.5 sm:px-6 sm:py-3 rounded text-[10px] sm:text-xl font-bold shadow-2xl leading-tight">
                PHONE LUNK DETECTED
              </div>
            </div>

            {/* Phone detection alarm effects (when active) */}
            {alarmActive && (
              <>
                {/* Red flashing border */}
                <div className="absolute inset-0 border-8 border-red-600 animate-pulse pointer-events-none" />

                {/* Full screen alarm overlay */}
                <div className="absolute inset-0 bg-red-600 opacity-20 animate-pulse pointer-events-none" />
              </>
            )}
          </>

          {/* Camera indicator */}
          <div className="absolute top-1 sm:top-4 left-1 sm:left-4 flex items-center gap-0.5 sm:gap-2 bg-black/50 px-1 py-0.5 sm:px-3 sm:py-2 rounded">
            <div className="w-1.5 h-1.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-[9px] sm:text-sm font-medium leading-tight">MONITORING</span>
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-1 sm:bottom-4 left-1 sm:left-4 bg-black/70 backdrop-blur-sm px-1 py-0.5 sm:px-4 sm:py-2 rounded">
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <span className={`text-[9px] sm:text-sm font-bold leading-tight ${alarmActive ? 'text-red-400' : 'text-green-400'}`}>
                {alarmActive ? 'PHONE DETECTED' : 'Monitoring'}
              </span>
              <span className="text-xs text-gray-300 hidden sm:inline">
                Objects: {alarmActive ? '2' : '1'} detected
              </span>
            </div>
          </div>
        </div>

        {/* Control bar mockup */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-300 text-sm">AI Detection Active</span>
          </div>
          <div className="text-gray-400 text-sm">
            Detections: <span className="text-white font-semibold">247</span> today
          </div>
        </div>
      </div>

      {/* Info text */}
      <p className="text-center mt-4 text-sm px-4 py-2 rounded-lg inline-block" style={{
        backgroundColor: 'var(--color-accent-light)',
        color: 'var(--color-accent-primary)'
      }}>
        Phone detected = alarm triggered + let the shaming begin!
      </p>
    </div>
  )
}

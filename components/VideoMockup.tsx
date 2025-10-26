'use client'

import { useState, useEffect } from 'react'

export default function VideoMockup() {
  const [alarmActive, setAlarmActive] = useState(false)
  const [showPersonBox, setShowPersonBox] = useState(true)

  // Simulate phone detection for demo purposes - synced with GIF timing
  useEffect(() => {
    // Show person detection continuously
    setShowPersonBox(true)

    // Trigger phone alarm every 4 seconds (better synced with GIF loop)
    const interval = setInterval(() => {
      setAlarmActive(true)
      setTimeout(() => setAlarmActive(false), 2500) // Alarm lasts 2.5 seconds
    }, 4000) // Trigger every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-12">
      {/* Main mockup container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Simulated camera feed with GIF */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* Gym phone GIF from makeagif */}
          <img
            src="https://i.makeagif.com/media/4-27-2014/ergLmS.gif"
            alt="Person on phone in gym"
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Detection overlays */}
          <>
            {/* Warning banner - always visible */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-red-600 text-white px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-xl shadow-2xl">
                🚨 PHONE LUNK DETECTED 🚨
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
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">MONITORING</span>
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className={`text-sm font-bold ${alarmActive ? 'text-red-400' : 'text-green-400'}`}>
                {alarmActive ? '⚠️ PHONE DETECTED' : '✓ Monitoring'}
              </span>
              <span className="text-xs text-gray-300">
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
        ↑ Phone detected = alarm triggered - that's the whole game
      </p>
    </div>
  )
}

'use client'

import { ALARM_THEMES, INTENSITY_SETTINGS, ThemeKey, IntensityLevel } from '@/lib/alarm-themes'

interface AlarmEffectProps {
  active: boolean
  theme?: ThemeKey
  intensity?: IntensityLevel
}

export default function AlarmEffect({
  active,
  theme = 'classic',
  intensity = 'medium'
}: AlarmEffectProps) {
  if (!active) return null

  const themeColors = ALARM_THEMES[theme]
  const intensitySettings = INTENSITY_SETTINGS[intensity]
  const animationDuration = `${intensitySettings.flashSpeed}ms`

  return (
    <>
      {/* Full screen flash overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 animate-pulse"
        style={{
          backgroundColor: themeColors.primary,
          opacity: intensitySettings.opacity,
          animationDuration,
        }}
      />

      {/* Pulsing border */}
      <div
        className="fixed inset-0 border-8 pointer-events-none z-50 animate-pulse"
        style={{
          borderColor: themeColors.secondary,
          animationDuration,
        }}
      />

      {/* Warning banner */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce pointer-events-none">
        <div
          className="px-8 py-4 rounded-xl font-bold text-2xl shadow-2xl flex items-center gap-3"
          style={{
            backgroundColor: themeColors.primary,
            color: themeColors.textColor,
          }}
        >
          <span className="text-3xl">🚨</span>
          <span>PHONE LUNK DETECTED</span>
          <span className="text-3xl">🚨</span>
        </div>
      </div>

      {/* Animated warning icons in corners */}
      <div className="fixed top-4 left-4 z-50 animate-spin pointer-events-none" style={{ animationDuration: '2s' }}>
        <div className="text-6xl">⚠️</div>
      </div>
      <div className="fixed top-4 right-4 z-50 animate-spin pointer-events-none" style={{ animationDuration: '2s' }}>
        <div className="text-6xl">⚠️</div>
      </div>
      <div className="fixed bottom-4 left-4 z-50 animate-spin pointer-events-none" style={{ animationDuration: '2s' }}>
        <div className="text-6xl">⚠️</div>
      </div>
      <div className="fixed bottom-4 right-4 z-50 animate-spin pointer-events-none" style={{ animationDuration: '2s' }}>
        <div className="text-6xl">⚠️</div>
      </div>

      {/* Siren icon */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="text-9xl animate-bounce" style={{ animationDuration: '0.5s' }}>
          🚨
        </div>
      </div>
    </>
  )
}

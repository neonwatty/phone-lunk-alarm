'use client'

import {
  ALARM_THEMES,
  INTENSITY_SETTINGS,
  ThemeKey,
  IntensityLevel,
} from '@/lib/alarm-themes'

interface ThemeSelectorProps {
  selectedTheme: ThemeKey
  selectedIntensity: IntensityLevel
  onThemeChange: (theme: ThemeKey) => void
  onIntensityChange: (intensity: IntensityLevel) => void
}

export default function ThemeSelector({
  selectedTheme,
  selectedIntensity,
  onThemeChange,
  onIntensityChange,
}: ThemeSelectorProps) {
  const currentTheme = ALARM_THEMES[selectedTheme]

  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-white text-xs font-semibold whitespace-nowrap">
          Theme:
        </label>
        <select
          value={selectedTheme}
          onChange={(e) => onThemeChange(e.target.value as ThemeKey)}
          className="flex-1 bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-purple-500 focus:outline-none"
        >
          {(Object.keys(ALARM_THEMES) as ThemeKey[]).map((key) => (
            <option key={key} value={key}>
              {ALARM_THEMES[key].name}
            </option>
          ))}
        </select>
        <div
          className="w-6 h-6 rounded border border-white/30"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
          }}
          title={currentTheme.description}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-white text-xs font-semibold whitespace-nowrap">
          Intensity:
        </label>
        <div className="flex gap-1 flex-1">
          {(Object.keys(INTENSITY_SETTINGS) as IntensityLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => onIntensityChange(level)}
              className={`flex-1 text-xs py-1 px-2 rounded transition-colors ${
                selectedIntensity === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {INTENSITY_SETTINGS[level].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

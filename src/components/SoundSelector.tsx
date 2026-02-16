'use client'

import { AlarmSoundType, ALARM_SOUNDS } from '@/hooks/useAlarmSound'

interface SoundSelectorProps {
  selectedSound: AlarmSoundType
  volume: number
  onSoundChange: (sound: AlarmSoundType) => void
  onVolumeChange: (volume: number) => void
  onPreview: () => void
}

export default function SoundSelector({
  selectedSound,
  volume,
  onSoundChange,
  onVolumeChange,
  onPreview,
}: SoundSelectorProps) {
  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-white text-xs font-semibold whitespace-nowrap">
          Alarm Sound:
        </label>
        <select
          value={selectedSound}
          onChange={(e) => onSoundChange(e.target.value as AlarmSoundType)}
          className="flex-1 bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-purple-500 focus:outline-none"
        >
          {Object.entries(ALARM_SOUNDS).map(([key, { name }]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={onPreview}
          disabled={selectedSound === 'none'}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs px-2 py-1 rounded transition-colors"
          title="Preview sound"
        >
          Test
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-white text-xs font-semibold whitespace-nowrap">
          Volume:
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <span className="text-white text-xs w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}

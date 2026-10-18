'use client'

import { useId } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { AlarmSoundType, ALARM_SOUNDS } from '@/hooks/useAlarmSound'

interface SoundSelectorProps {
  selectedSound: AlarmSoundType
  volume: number
  onSoundChange: (sound: AlarmSoundType) => void
  onVolumeChange: (volume: number) => void
  onPreview: () => void
  onToggleMute: () => void
}

export default function SoundSelector({selectedSound,volume,onSoundChange,onVolumeChange,onPreview,onToggleMute}: SoundSelectorProps) {
  const id = useId()
  const muted = selectedSound === 'none' || volume === 0
  return <div className="sound-settings">
    <div className="sound-heading">
      <label htmlFor={`${id}-sound`}>Alarm sound</label>
      <button type="button" className="sound-mute" onClick={onToggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute alarm' : 'Mute alarm'}>
        {muted ? <SpeakerXMarkIcon aria-hidden="true" /> : <SpeakerWaveIcon aria-hidden="true" />}
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
    <div className="sound-choice">
      <select id={`${id}-sound`} value={selectedSound} onChange={e=>onSoundChange(e.target.value as AlarmSoundType)}>
        {Object.entries(ALARM_SOUNDS).map(([key,{name}])=><option key={key} value={key}>{name}</option>)}
      </select>
      <button type="button" onClick={onPreview} disabled={selectedSound==='none'||volume===0}>Test sound</button>
    </div>
    <div className="sound-volume-label"><label htmlFor={`${id}-volume`}>Volume</label><span>{Math.round(volume*100)}%</span></div>
    <input id={`${id}-volume`} type="range" min="0" max="1" step="0.1" value={volume} onChange={e=>onVolumeChange(Number(e.target.value))} />
    {muted && <p>Alarm muted. Visual alerts stay on.</p>}
  </div>
}

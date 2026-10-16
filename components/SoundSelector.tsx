'use client'

import { useId } from 'react'
import { AlarmSoundType, ALARM_SOUNDS } from '@/hooks/useAlarmSound'

interface SoundSelectorProps {
  selectedSound: AlarmSoundType
  volume: number
  onSoundChange: (sound: AlarmSoundType) => void
  onVolumeChange: (volume: number) => void
  onPreview: () => void
}

export default function SoundSelector({selectedSound,volume,onSoundChange,onVolumeChange,onPreview}: SoundSelectorProps) {
  const id = useId()
  return <div className="sound-settings">
    <label htmlFor={`${id}-sound`}>Alarm sound</label>
    <div className="sound-choice">
      <select id={`${id}-sound`} value={selectedSound} onChange={e=>onSoundChange(e.target.value as AlarmSoundType)}>
        {Object.entries(ALARM_SOUNDS).map(([key,{name}])=><option key={key} value={key}>{name}</option>)}
      </select>
      <button type="button" onClick={onPreview} disabled={selectedSound==='none'||volume===0}>Test sound</button>
    </div>
    <div className="sound-volume-label"><label htmlFor={`${id}-volume`}>Volume</label><span>{Math.round(volume*100)}%</span></div>
    <input id={`${id}-volume`} type="range" min="0" max="1" step="0.1" value={volume} onChange={e=>onVolumeChange(Number(e.target.value))} />
    <p>{selectedSound==='none'||volume===0 ? 'Sound is off. Visual detection remains active.' : 'The alarm plays on this device. Test the volume before starting.'}</p>
  </div>
}

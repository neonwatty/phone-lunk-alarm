'use client'

import { useRef, useEffect, useCallback, useState } from 'react'

export type AlarmSoundType = 'airhorn' | 'lunk-alarm' | 'shame-bell' | 'buzzer' | 'submarine' | 'fire-alert' | 'none'

export const ALARM_SOUNDS: Record<AlarmSoundType, { name: string; file: string | null }> = {
  'airhorn': { name: 'Air Horn', file: '/sounds/airhorn.wav' },
  'lunk-alarm': { name: 'Lunk Alarm', file: '/sounds/lunk-alarm.wav' },
  'shame-bell': { name: 'Bell', file: '/sounds/shame-bell.wav' },
  'buzzer': { name: 'Buzzer', file: '/sounds/buzzer.wav' },
  'submarine': { name: 'Submarine', file: '/sounds/submarine.wav' },
  'fire-alert': { name: 'Fire Alert', file: '/sounds/fire-alert.wav' },
  'none': { name: 'No Sound', file: null },
}

export const DEFAULT_ALARM_SOUND: AlarmSoundType = 'submarine'

const STORAGE_KEY = 'phoneLunkAlarmSound'
const VOLUME_KEY = 'phoneLunkAlarmVolume'

export function useAlarmSound() {
  const previewRef = useRef<HTMLAudioElement | null>(null)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audibleVolumeRef = useRef(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [selectedSound, setSelectedSound] = useState<AlarmSoundType>(DEFAULT_ALARM_SOUND)
  const [volume, setVolume] = useState(0.7)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem(STORAGE_KEY) as AlarmSoundType | null
      const savedVolume = localStorage.getItem(VOLUME_KEY)

      if (savedSound && ALARM_SOUNDS[savedSound]) {
        setSelectedSound(savedSound)
      }
      if (savedVolume) {
        setVolume(parseFloat(savedVolume))
      }
      setIsLoaded(true)
    }
  }, [])

  // Preload audio when sound selection changes
  useEffect(() => {
    if (!isLoaded) return

    const soundConfig = ALARM_SOUNDS[selectedSound]
    if (!soundConfig.file) {
      audioRef.current = null
      return
    }

    const audio = new Audio(soundConfig.file)
    audio.preload = 'auto'
    audio.volume = volume
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [selectedSound, isLoaded])

  // Update volume when it changes
  useEffect(() => {
    if (volume > 0) audibleVolumeRef.current = volume
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Play the alarm sound
  const playSound = useCallback(() => {
    if (!audioRef.current) return

    // Reset and play
    audioRef.current.currentTime = 0
    audioRef.current.play().catch((err) => {
      console.warn('Audio playback failed:', err)
    })
  }, [])

  // Stop the sound
  const stopSound = useCallback(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current)
    previewRef.current?.pause(); previewRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  useEffect(() => () => stopSound(), [stopSound])

  // Preview sound (for selector)
  const previewSound = useCallback(() => {
    const soundConfig = ALARM_SOUNDS[selectedSound]
    if (!soundConfig.file) return

    stopSound()
    const previewAudio = new Audio(soundConfig.file)
    previewRef.current = previewAudio
    previewAudio.volume = volume
    previewAudio.play().catch((err) => {
      console.warn('Preview playback failed:', err)
    })

    // Stop after 2 seconds
    previewTimer.current = setTimeout(() => {
      previewAudio.pause()
      previewRef.current = null
    }, 2000)
  }, [selectedSound, volume, stopSound])

  // Change sound selection
  const changeSound = useCallback((sound: AlarmSoundType) => {
    setSelectedSound(sound)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, sound)
    }
  }, [])

  // Change volume
  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    if (typeof window !== 'undefined') {
      localStorage.setItem(VOLUME_KEY, clampedVolume.toString())
    }
  }, [])

  const isMuted = selectedSound === 'none' || volume === 0
  const toggleMute = useCallback(() => {
    stopSound()
    if (selectedSound === 'none' || volume === 0) {
      if (selectedSound === 'none') changeSound(DEFAULT_ALARM_SOUND)
      if (volume === 0) changeVolume(audibleVolumeRef.current)
    } else {
      changeVolume(0)
    }
  }, [selectedSound, volume, changeSound, changeVolume, stopSound])

  return {
    selectedSound,
    volume,
    playSound,
    stopSound,
    previewSound,
    changeSound,
    changeVolume,
    isLoaded,
    isMuted,
    toggleMute,
  }
}

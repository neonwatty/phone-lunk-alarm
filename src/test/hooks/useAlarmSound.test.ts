import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAlarmSound, ALARM_SOUNDS } from '@/hooks/useAlarmSound'

// Mock HTMLAudioElement using a class so `new Audio()` works
const mockPlay = vi.fn().mockResolvedValue(undefined)
const mockPause = vi.fn()

class MockAudio {
  play = mockPlay
  pause = mockPause
  preload = ''
  volume = 1
  currentTime = 0
  src = ''
  constructor(src?: string) {
    if (src) this.src = src
  }
}

vi.stubGlobal('Audio', MockAudio)

describe('useAlarmSound', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('ALARM_SOUNDS', () => {
    it('has all expected sound types', () => {
      expect(ALARM_SOUNDS['airhorn']).toBeDefined()
      expect(ALARM_SOUNDS['lunk-alarm']).toBeDefined()
      expect(ALARM_SOUNDS['shame-bell']).toBeDefined()
      expect(ALARM_SOUNDS['buzzer']).toBeDefined()
      expect(ALARM_SOUNDS['none']).toBeDefined()
    })

    it('none sound has null file', () => {
      expect(ALARM_SOUNDS['none'].file).toBeNull()
    })

    it('all non-none sounds have file paths', () => {
      const soundKeys = Object.keys(ALARM_SOUNDS).filter((k) => k !== 'none')
      soundKeys.forEach((key) => {
        expect(ALARM_SOUNDS[key as keyof typeof ALARM_SOUNDS].file).toBeTruthy()
      })
    })
  })

  describe('default state', () => {
    it('defaults to airhorn sound', () => {
      const { result } = renderHook(() => useAlarmSound())
      expect(result.current.selectedSound).toBe('airhorn')
    })

    it('defaults to 0.7 volume', () => {
      const { result } = renderHook(() => useAlarmSound())
      expect(result.current.volume).toBe(0.7)
    })
  })

  describe('changeSound', () => {
    it('changes the selected sound', () => {
      const { result } = renderHook(() => useAlarmSound())

      act(() => {
        result.current.changeSound('buzzer')
      })

      expect(result.current.selectedSound).toBe('buzzer')
    })

    it('persists the sound choice to localStorage', () => {
      const { result } = renderHook(() => useAlarmSound())

      act(() => {
        result.current.changeSound('shame-bell')
      })

      expect(localStorage.getItem('phoneLunkAlarmSound')).toBe('shame-bell')
    })
  })

  describe('changeVolume', () => {
    it('changes the volume', () => {
      const { result } = renderHook(() => useAlarmSound())

      act(() => {
        result.current.changeVolume(0.5)
      })

      expect(result.current.volume).toBe(0.5)
    })

    it('clamps volume to 0-1 range', () => {
      const { result } = renderHook(() => useAlarmSound())

      act(() => {
        result.current.changeVolume(1.5)
      })
      expect(result.current.volume).toBe(1)

      act(() => {
        result.current.changeVolume(-0.5)
      })
      expect(result.current.volume).toBe(0)
    })

    it('persists volume to localStorage', () => {
      const { result } = renderHook(() => useAlarmSound())

      act(() => {
        result.current.changeVolume(0.3)
      })

      expect(localStorage.getItem('phoneLunkAlarmVolume')).toBe('0.3')
    })
  })

  describe('playSound', () => {
    it('calls play on audio element', () => {
      const { result } = renderHook(() => useAlarmSound())

      act(() => {
        result.current.playSound()
      })

      expect(mockPlay).toHaveBeenCalled()
    })
  })

  describe('loading preferences', () => {
    it('loads saved sound preference from localStorage', () => {
      localStorage.setItem('phoneLunkAlarmSound', 'buzzer')
      const { result } = renderHook(() => useAlarmSound())

      // Wait for the useEffect to fire
      expect(result.current.selectedSound).toBe('buzzer')
    })

    it('loads saved volume from localStorage', () => {
      localStorage.setItem('phoneLunkAlarmVolume', '0.4')
      const { result } = renderHook(() => useAlarmSound())

      expect(result.current.volume).toBe(0.4)
    })
  })
})

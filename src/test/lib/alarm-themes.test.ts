import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ALARM_THEMES,
  INTENSITY_SETTINGS,
  loadThemePreference,
  saveThemePreference,
  loadIntensityPreference,
  saveIntensityPreference,
  type ThemeKey,
  type IntensityLevel,
} from '@/lib/alarm-themes'

describe('alarm-themes', () => {
  describe('ALARM_THEMES', () => {
    it('has all expected theme keys', () => {
      const keys: ThemeKey[] = ['classic', 'planetFitness', 'neon', 'stealth', 'fire']
      keys.forEach((key) => {
        expect(ALARM_THEMES[key]).toBeDefined()
      })
    })

    it('each theme has required properties', () => {
      Object.values(ALARM_THEMES).forEach((theme) => {
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('primary')
        expect(theme).toHaveProperty('secondary')
        expect(theme).toHaveProperty('textColor')
        expect(theme).toHaveProperty('description')
      })
    })

    it('classic theme has expected colors', () => {
      expect(ALARM_THEMES.classic.primary).toBe('#EF4444')
      expect(ALARM_THEMES.classic.secondary).toBe('#DC2626')
      expect(ALARM_THEMES.classic.textColor).toBe('#FFFFFF')
    })

    it('planetFitness theme has purple and yellow', () => {
      expect(ALARM_THEMES.planetFitness.primary).toBe('#A4278D')
      expect(ALARM_THEMES.planetFitness.secondary).toBe('#F9F72E')
    })
  })

  describe('INTENSITY_SETTINGS', () => {
    it('has all expected intensity levels', () => {
      const levels: IntensityLevel[] = ['low', 'medium', 'high']
      levels.forEach((level) => {
        expect(INTENSITY_SETTINGS[level]).toBeDefined()
      })
    })

    it('each intensity has required properties', () => {
      Object.values(INTENSITY_SETTINGS).forEach((setting) => {
        expect(setting).toHaveProperty('flashSpeed')
        expect(setting).toHaveProperty('opacity')
        expect(setting).toHaveProperty('label')
        expect(typeof setting.flashSpeed).toBe('number')
        expect(typeof setting.opacity).toBe('number')
      })
    })

    it('higher intensity means faster flash speed and higher opacity', () => {
      expect(INTENSITY_SETTINGS.high.flashSpeed).toBeLessThan(
        INTENSITY_SETTINGS.medium.flashSpeed
      )
      expect(INTENSITY_SETTINGS.medium.flashSpeed).toBeLessThan(
        INTENSITY_SETTINGS.low.flashSpeed
      )
      expect(INTENSITY_SETTINGS.high.opacity).toBeGreaterThan(
        INTENSITY_SETTINGS.medium.opacity
      )
      expect(INTENSITY_SETTINGS.medium.opacity).toBeGreaterThan(
        INTENSITY_SETTINGS.low.opacity
      )
    })
  })

  describe('Theme preference persistence', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('loadThemePreference returns classic by default', () => {
      expect(loadThemePreference()).toBe('classic')
    })

    it('saveThemePreference and loadThemePreference round-trip', () => {
      saveThemePreference('neon')
      expect(loadThemePreference()).toBe('neon')
    })

    it('loadThemePreference returns classic for invalid saved value', () => {
      localStorage.setItem('phoneLunkAlarmTheme', 'invalidTheme')
      expect(loadThemePreference()).toBe('classic')
    })
  })

  describe('Intensity preference persistence', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('loadIntensityPreference returns medium by default', () => {
      expect(loadIntensityPreference()).toBe('medium')
    })

    it('saveIntensityPreference and loadIntensityPreference round-trip', () => {
      saveIntensityPreference('high')
      expect(loadIntensityPreference()).toBe('high')
    })

    it('loadIntensityPreference returns medium for invalid saved value', () => {
      localStorage.setItem('phoneLunkAlarmIntensity', 'extreme')
      expect(loadIntensityPreference()).toBe('medium')
    })
  })
})

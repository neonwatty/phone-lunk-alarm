export type AlarmTheme = {
  name: string
  primary: string
  secondary: string
  textColor: string
  description: string
}

export type ThemeKey = 'classic' | 'planetFitness' | 'neon' | 'stealth' | 'fire'

export const ALARM_THEMES: Record<ThemeKey, AlarmTheme> = {
  classic: {
    name: 'Classic Red',
    primary: '#EF4444',
    secondary: '#DC2626',
    textColor: '#FFFFFF',
    description: 'The original alarm look',
  },
  planetFitness: {
    name: 'Planet Fitness',
    primary: '#A4278D',
    secondary: '#F9F72E',
    textColor: '#F9F72E',
    description: 'Purple and yellow gym vibes',
  },
  neon: {
    name: 'Neon',
    primary: '#00FF88',
    secondary: '#FF00FF',
    textColor: '#00FF88',
    description: 'Bright cyberpunk colors',
  },
  stealth: {
    name: 'Stealth Mode',
    primary: '#374151',
    secondary: '#6B7280',
    textColor: '#9CA3AF',
    description: 'Subtle and low-key',
  },
  fire: {
    name: 'Fire',
    primary: '#F97316',
    secondary: '#FACC15',
    textColor: '#FFFFFF',
    description: 'Orange and yellow flames',
  },
}

export type IntensityLevel = 'low' | 'medium' | 'high'

export const INTENSITY_SETTINGS: Record<IntensityLevel, { flashSpeed: number; opacity: number; label: string }> = {
  low: { flashSpeed: 1000, opacity: 0.3, label: 'Low' },
  medium: { flashSpeed: 500, opacity: 0.5, label: 'Medium' },
  high: { flashSpeed: 200, opacity: 0.7, label: 'High' },
}

const THEME_STORAGE_KEY = 'phoneLunkAlarmTheme'
const INTENSITY_STORAGE_KEY = 'phoneLunkAlarmIntensity'

export function loadThemePreference(): ThemeKey {
  if (typeof window === 'undefined') return 'classic'
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeKey | null
  return saved && ALARM_THEMES[saved] ? saved : 'classic'
}

export function saveThemePreference(theme: ThemeKey): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function loadIntensityPreference(): IntensityLevel {
  if (typeof window === 'undefined') return 'medium'
  const saved = localStorage.getItem(INTENSITY_STORAGE_KEY) as IntensityLevel | null
  return saved && INTENSITY_SETTINGS[saved] ? saved : 'medium'
}

export function saveIntensityPreference(intensity: IntensityLevel): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(INTENSITY_STORAGE_KEY, intensity)
}

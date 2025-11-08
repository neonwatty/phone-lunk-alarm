/**
 * Storage utility for persisting app data
 * Works in both browser (localStorage) and Capacitor (Preferences API)
 */

import { Preferences } from '@capacitor/preferences';

const STORAGE_KEYS = {
  STATS: 'phone-lunk-stats',
  SETTINGS: 'phone-lunk-settings',
  FIRST_LAUNCH: 'phone-lunk-first-launch',
} as const;

/**
 * Check if running in Capacitor (native app)
 */
const isCapacitor = (): boolean => {
  return typeof window !== 'undefined' && 'Capacitor' in window;
};

/**
 * Generic storage interface
 */
interface Storage {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * Browser localStorage implementation
 */
const browserStorage: Storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Capacitor Preferences implementation
 */
const capacitorStorage: Storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from Capacitor Preferences:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await Preferences.set({ key, value: JSON.stringify(value) });
    } catch (error) {
      console.error('Error writing to Capacitor Preferences:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Error removing from Capacitor Preferences:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing Capacitor Preferences:', error);
    }
  },
};

/**
 * Get the appropriate storage implementation
 */
const getStorage = (): Storage => {
  return isCapacitor() ? capacitorStorage : browserStorage;
};

// Export storage instance
export const storage = getStorage();

// Export storage keys
export { STORAGE_KEYS };

/**
 * Stats data structure
 */
export interface StatsData {
  totalSessions: number;
  totalPhonesDetected: number;
  totalTimeSeconds: number;
  lastSessionDate: string | null;
}

/**
 * Settings data structure
 */
export interface SettingsData {
  alarmSound: boolean;
  autoCapture: boolean;
  darkMode: boolean;
  detectionSensitivity: number; // 0-100, default 35
}

/**
 * Default stats
 */
export const DEFAULT_STATS: StatsData = {
  totalSessions: 0,
  totalPhonesDetected: 0,
  totalTimeSeconds: 0,
  lastSessionDate: null,
};

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: SettingsData = {
  alarmSound: true,
  autoCapture: false,
  darkMode: false,
  detectionSensitivity: 35,
};

/**
 * Load stats from storage
 */
export const loadStats = async (): Promise<StatsData> => {
  const stats = await storage.get<StatsData>(STORAGE_KEYS.STATS);
  return stats || DEFAULT_STATS;
};

/**
 * Save stats to storage
 */
export const saveStats = async (stats: StatsData): Promise<void> => {
  await storage.set(STORAGE_KEYS.STATS, stats);
};

/**
 * Load settings from storage
 */
export const loadSettings = async (): Promise<SettingsData> => {
  const settings = await storage.get<SettingsData>(STORAGE_KEYS.SETTINGS);
  return settings || DEFAULT_SETTINGS;
};

/**
 * Save settings to storage
 */
export const saveSettings = async (settings: SettingsData): Promise<void> => {
  await storage.set(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Check if this is the first app launch
 */
export const isFirstLaunch = async (): Promise<boolean> => {
  const hasLaunched = await storage.get<boolean>(STORAGE_KEYS.FIRST_LAUNCH);
  return hasLaunched === null;
};

/**
 * Mark that the app has been launched
 */
export const markLaunched = async (): Promise<void> => {
  await storage.set(STORAGE_KEYS.FIRST_LAUNCH, true);
};

/**
 * Clear all app data (for settings reset)
 */
export const clearAllData = async (): Promise<void> => {
  await storage.remove(STORAGE_KEYS.STATS);
  await storage.remove(STORAGE_KEYS.SETTINGS);
  // Keep first launch flag so tutorial doesn't show again
};

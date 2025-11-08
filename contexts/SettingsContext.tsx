'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadSettings, saveSettings, SettingsData, DEFAULT_SETTINGS } from '@/lib/storage';

interface SettingsContextValue {
  settings: SettingsData;
  updateSettings: (updates: Partial<SettingsData>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadInitialSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSettings();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<SettingsData>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, [settings]);

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  }, []);

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

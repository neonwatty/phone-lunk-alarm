'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadStats, saveStats, StatsData, DEFAULT_STATS, clearAllData } from '@/lib/storage';

interface StatsContextValue {
  stats: StatsData;
  recordSession: (detectionCount: number, durationSeconds: number) => Promise<void>;
  clearStats: () => Promise<void>;
  isLoading: boolean;
}

const StatsContext = createContext<StatsContextValue | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Load stats on mount
  useEffect(() => {
    const loadInitialStats = async () => {
      try {
        const savedStats = await loadStats();
        setStats(savedStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialStats();
  }, []);

  const recordSession = useCallback(async (detectionCount: number, durationSeconds: number) => {
    const newStats: StatsData = {
      totalSessions: stats.totalSessions + 1,
      totalPhonesDetected: stats.totalPhonesDetected + detectionCount,
      totalTimeSeconds: stats.totalTimeSeconds + durationSeconds,
      lastSessionDate: new Date().toISOString(),
    };

    setStats(newStats);
    await saveStats(newStats);
  }, [stats]);

  const clearStats = useCallback(async () => {
    setStats(DEFAULT_STATS);
    await clearAllData();
  }, []);

  const value: StatsContextValue = {
    stats,
    recordSession,
    clearStats,
    isLoading,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
}

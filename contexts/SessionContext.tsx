'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Session state for active detection session
 */
interface SessionState {
  isActive: boolean;
  startTime: number | null;
  detectionCount: number;
  elapsedSeconds: number;
  screenshots: string[]; // Base64 or blob URLs
}

interface SessionContextValue {
  session: SessionState;
  startSession: () => void;
  stopSession: () => SessionResult;
  incrementDetection: () => void;
  addScreenshot: (screenshot: string) => void;
  resetSession: () => void;
}

interface SessionResult {
  duration: number;
  detectionCount: number;
  screenshots: string[];
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const initialState: SessionState = {
  isActive: false,
  startTime: null,
  detectionCount: 0,
  elapsedSeconds: 0,
  screenshots: [],
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>(initialState);

  // Timer to track elapsed time
  useEffect(() => {
    if (!session.isActive || !session.startTime) return;

    const interval = setInterval(() => {
      setSession((prev) => ({
        ...prev,
        elapsedSeconds: Math.floor((Date.now() - (prev.startTime || 0)) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isActive, session.startTime]);

  const startSession = useCallback(() => {
    setSession({
      isActive: true,
      startTime: Date.now(),
      detectionCount: 0,
      elapsedSeconds: 0,
      screenshots: [],
    });
  }, []);

  const stopSession = useCallback((): SessionResult => {
    const result: SessionResult = {
      duration: session.elapsedSeconds,
      detectionCount: session.detectionCount,
      screenshots: session.screenshots,
    };

    setSession(initialState);
    return result;
  }, [session]);

  const incrementDetection = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      detectionCount: prev.detectionCount + 1,
    }));
  }, []);

  const addScreenshot = useCallback((screenshot: string) => {
    setSession((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, screenshot],
    }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(initialState);
  }, []);

  const value: SessionContextValue = {
    session,
    startSession,
    stopSession,
    incrementDetection,
    addScreenshot,
    resetSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}

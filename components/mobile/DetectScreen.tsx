'use client';

import { useSession } from '@/contexts/SessionContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePhoneDetection } from '@/hooks/usePhoneDetection';
import MobileCamera from './MobileCamera';
import AlarmEffect from '../AlarmEffect';

export default function DetectScreen() {
  const { session, startSession, stopSession, incrementDetection } = useSession();
  const { settings } = useSettings();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle phone detection callback
  const handlePhoneDetected = useCallback(() => {
    console.log('[DetectScreen] Phone detected! Incrementing count...');
    incrementDetection();

    // TODO: Play alarm sound if enabled
    // if (settings.alarmSound) {
    //   // Play sound
    // }

    // TODO: Auto-capture screenshot if enabled
    // if (settings.autoCapture) {
    //   // Capture screenshot
    // }
  }, [incrementDetection]);

  // Initialize phone detection
  const detection = usePhoneDetection({
    isActive: session.isActive,
    onPhoneDetected: handlePhoneDetected,
    confidenceThreshold: settings.detectionSensitivity / 100,
    alarmDuration: 5000,
    cooldownPeriod: 3000,
  });

  const handleStart = () => {
    console.log('[DetectScreen] Starting detection session');
    setCameraError(null);
    startSession();
  };

  const handleStop = () => {
    console.log('[DetectScreen] Stopping detection session');
    const result = stopSession();
    // TODO: Show session summary with result
    console.log('[DetectScreen] Session result:', result);
  };

  const handleSwitchCamera = () => {
    console.log('[DetectScreen] Switching camera');
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Tap to show controls, auto-hide after 3 seconds
  const handleScreenTap = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Loading state
  if (detection.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)]">
        <div className="animate-spin text-6xl mb-4">⚙️</div>
        <p className="text-[var(--color-text-primary)] text-xl font-bold">
          Loading AI model...
        </p>
        <p className="text-[var(--color-text-secondary)] mt-2">This may take a moment</p>
      </div>
    );
  }

  // Compatibility error
  if (!detection.isCompatible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)]">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-[var(--color-text-primary)] text-xl font-bold mb-2">
          Incompatible Device
        </p>
        <p className="text-[var(--color-text-secondary)] text-center">
          Your device doesn't support the required features (camera or WebGL).
        </p>
      </div>
    );
  }

  // Model error
  if (detection.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)]">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-500 text-lg font-bold mb-4">{detection.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[var(--color-primary)] active:bg-[var(--color-primary-dark)] text-white font-bold py-3 px-6 rounded-[var(--radius-md)] transition-colors duration-200 min-h-[var(--tap-target-min)]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Camera error
  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)]">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-red-500 text-lg font-bold mb-2">Camera Error</p>
        <p className="text-[var(--color-text-secondary)] text-center mb-6">
          {cameraError}
        </p>
        <button
          onClick={() => {
            setCameraError(null);
            handleStart();
          }}
          className="bg-[var(--color-primary)] active:bg-[var(--color-primary-dark)] text-white font-bold py-3 px-6 rounded-[var(--radius-md)] transition-colors duration-200 min-h-[var(--tap-target-min)]"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Inactive state - ready to start
  if (!session.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)]">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-6xl">📸</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Ready to catch some phone lunks?
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Point your camera at phones and we'll detect them automatically
          </p>
        </div>

        <div
          onPointerDown={(e) => {
            e.preventDefault();
            console.log('[DetectScreen] START button - pointer down detected');
            handleStart();
          }}
          role="button"
          tabIndex={0}
          className="w-full bg-[var(--color-primary)] active:bg-[#8B1F75] text-white font-semibold py-[13px] px-6 rounded-[var(--radius-md)] transition-colors duration-150 text-[17px] leading-[22px] tracking-[-0.011em] touch-manipulation cursor-pointer text-center select-none min-h-[var(--tap-target-min)]"
        >
          START DETECTION
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onTouchStart={() => {
              console.log('[DetectScreen] Switch Camera - touch start');
            }}
            onClick={() => {
              console.log('[DetectScreen] Switch Camera - click detected');
              handleSwitchCamera();
            }}
            className="text-[var(--color-text-secondary)] active:text-[var(--color-text-primary)] transition-colors touch-manipulation cursor-pointer min-h-[var(--tap-target-min)] px-[var(--spacing-sm)]"
          >
            🔄 Switch Camera
          </button>
        </div>
      </div>
    );
  }

  // Active detection state - Full screen camera with tap-to-reveal controls
  return (
    <div className="relative h-screen pb-16 bg-black">
      {/* Full-screen camera container with tap handler */}
      <div
        className="absolute inset-0 bottom-16"
        onClick={handleScreenTap}
      >
        <MobileCamera
          isActive={session.isActive}
          facingMode={facingMode}
          onCameraError={setCameraError}
          onSwitchCamera={handleSwitchCamera}
          detectPhone={detection.detectPhone}
          drawPredictions={detection.drawPredictions}
          detectionCount={session.detectionCount}
          phoneDetected={detection.phoneDetected}
          elapsedSeconds={session.elapsedSeconds}
        />
      </div>

      {/* Tap-to-reveal controls overlay */}
      {showControls && (
        <div className="absolute inset-0 bottom-16 bg-black bg-opacity-50 flex items-end justify-center pb-[calc(var(--safe-area-bottom)+var(--spacing-lg))] px-[var(--spacing-md)] z-40 animate-fade-in">
          <div className="w-full space-y-[var(--spacing-xs)]">
            {/* Stop button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStop();
              }}
              className="w-full bg-red-600 active:bg-red-700 text-white font-semibold py-[13px] px-6 rounded-[var(--radius-md)] transition-colors duration-150 text-[17px] leading-[22px] tracking-[-0.011em] touch-manipulation min-h-[var(--tap-target-min)]"
            >
              STOP DETECTION
            </button>

            {/* Switch camera button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSwitchCamera();
              }}
              className="w-full bg-[var(--ios-system-gray6)] bg-opacity-80 backdrop-blur-sm active:bg-[var(--ios-system-gray5)] text-[var(--ios-label-color)] font-semibold py-[13px] px-6 rounded-[var(--radius-md)] transition-colors duration-150 text-[17px] touch-manipulation min-h-[var(--tap-target-min)]"
            >
              Switch Camera
            </button>
          </div>
        </div>
      )}

      {/* Alarm Effect */}
      <AlarmEffect active={detection.phoneDetected} />
    </div>
  );
}

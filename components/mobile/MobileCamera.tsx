'use client';

import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

interface Prediction {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

interface MobileCameraProps {
  isActive: boolean;
  facingMode: 'user' | 'environment';
  onCameraReady?: () => void;
  onCameraError?: (error: string) => void;
  onSwitchCamera?: () => void;
  detectPhone?: (video: HTMLVideoElement) => Promise<Prediction[]>;
  drawPredictions?: (
    ctx: CanvasRenderingContext2D,
    predictions: Prediction[],
    canvasWidth: number,
    canvasHeight: number
  ) => void;
  detectionInterval?: number;
  detectionCount?: number;
  phoneDetected?: boolean;
  elapsedSeconds?: number;
}

export default function MobileCamera({
  isActive,
  facingMode,
  onCameraReady,
  onCameraError,
  onSwitchCamera,
  detectPhone,
  drawPredictions,
  detectionInterval = 100,
  detectionCount = 0,
  phoneDetected = false,
  elapsedSeconds = 0,
}: MobileCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionLoopRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Run detection loop when active and camera is ready
  useEffect(() => {
    if (!isActive || !cameraReady || !detectPhone || !drawPredictions) {
      return;
    }

    const runDetectionLoop = async () => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!video || !canvas || !ctx || video.readyState !== 4) {
        return;
      }

      // Set canvas dimensions to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      try {
        // Run detection
        const predictions = await detectPhone(video);

        // Draw predictions
        drawPredictions(ctx, predictions, canvas.width, canvas.height);
      } catch (err) {
        console.error('[MobileCamera] Detection loop error:', err);
      }
    };

    // Start detection loop
    detectionLoopRef.current = setInterval(runDetectionLoop, detectionInterval);

    return () => {
      if (detectionLoopRef.current) {
        clearInterval(detectionLoopRef.current);
        detectionLoopRef.current = null;
      }
    };
  }, [isActive, cameraReady, detectPhone, drawPredictions, detectionInterval]);

  // Handle camera ready
  const handleUserMedia = () => {
    console.log('[MobileCamera] Camera ready');
    setCameraReady(true);
    if (onCameraReady) {
      onCameraReady();
    }
  };

  // Handle camera errors
  const handleUserMediaError = (err: any) => {
    console.error('[MobileCamera] Camera error:', err);
    setCameraReady(false);

    // Parse specific error types
    let errorMessage = 'Camera access failed. Please try again.';

    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      errorMessage = 'No camera detected.';
    } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorMessage = 'Camera access denied. Please allow camera access in settings.';
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      errorMessage = 'Camera is being used by another app.';
    } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
      errorMessage = 'Selected camera mode not available.';
    }

    if (onCameraError) {
      onCameraError(errorMessage);
    }
  };

  // Handle camera switch
  const handleCameraSwitch = () => {
    // Stop current stream
    if (webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setCameraReady(false);

    if (onSwitchCamera) {
      onSwitchCamera();
    }
  };

  if (!isActive) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-[var(--color-bg-secondary)] aspect-video flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-[var(--color-text-primary)] text-lg font-bold mb-2">
            Camera is off
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Tap "Start Detection" to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Webcam feed */}
      <Webcam
        ref={webcamRef}
        audio={false}
        className="w-full h-full object-cover"
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
      />

      {/* Canvas overlay for detection boxes */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Top floating stats badges */}
      <div className="absolute top-[calc(var(--safe-area-top)+var(--spacing-xs))] left-[var(--spacing-xs)] right-[var(--spacing-xs)] flex justify-between items-start gap-2">
        {/* Timer badge - top left */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm px-2.5 py-1.5 rounded-[var(--radius-sm)]">
          <span className="text-white text-xs font-semibold">
            ⏱ {formatTime(elapsedSeconds)}
          </span>
        </div>

        {/* Monitoring indicator - top center */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm px-3 py-1.5 rounded-[var(--radius-sm)] flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">MONITORING</span>
        </div>

        {/* Detection count badge - top right */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm px-2.5 py-1.5 rounded-[var(--radius-sm)]">
          <span className="text-white text-xs font-semibold">
            📱 {detectionCount}
          </span>
        </div>
      </div>

      {/* Bottom detection status - centered */}
      <div className="absolute bottom-[calc(var(--safe-area-bottom)+var(--spacing-xs))] left-0 right-0 flex justify-center">
        <div className="bg-black bg-opacity-70 backdrop-blur-sm px-4 py-1.5 rounded-[var(--radius-sm)]">
          <span
            className={`text-xs font-semibold ${
              phoneDetected ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {phoneDetected ? '⚠️ PHONE DETECTED' : '✓ All Clear'}
          </span>
        </div>
      </div>
    </div>
  );
}

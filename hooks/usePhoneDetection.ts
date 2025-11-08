import { useState, useEffect, useRef, useCallback } from 'react';

// TensorFlow types
interface Prediction {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

// Dynamic imports for TensorFlow (avoid SSR issues)
let cocoSsd: any = null;
let tf: any = null;

export interface UsePhoneDetectionOptions {
  isActive: boolean;                    // Control detection loop
  onPhoneDetected?: () => void;         // Callback when phone found
  confidenceThreshold?: number;         // Default 0.35 (0.0-1.0)
  alarmDuration?: number;               // Default 5000ms
  cooldownPeriod?: number;              // Default 3000ms
}

export interface UsePhoneDetectionReturn {
  // Model state
  modelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  isCompatible: boolean;

  // Detection state
  phoneDetected: boolean;
  detectionCount: number;

  // Methods
  detectPhone: (video: HTMLVideoElement) => Promise<Prediction[]>;
  drawPredictions: (
    ctx: CanvasRenderingContext2D,
    predictions: Prediction[],
    canvasWidth: number,
    canvasHeight: number
  ) => void;
  resetDetectionCount: () => void;
}

export function usePhoneDetection({
  isActive,
  onPhoneDetected,
  confidenceThreshold = 0.35,
  alarmDuration = 5000,
  cooldownPeriod = 3000,
}: UsePhoneDetectionOptions): UsePhoneDetectionReturn {
  // Model state
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompatible, setIsCompatible] = useState(true);

  // Detection state
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);

  // Refs for alarm management
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAlarmTimeRef = useRef<number>(0);

  // Check browser compatibility
  useEffect(() => {
    const checkCompatibility = () => {
      const hasUserMedia = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );
      const hasWebGL = (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(
            canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
          );
        } catch (e) {
          return false;
        }
      })();

      setIsCompatible(hasUserMedia && hasWebGL);
    }

    checkCompatibility();
  }, []);

  // Load the model
  useEffect(() => {
    if (!isCompatible) {
      setIsLoading(false);
      return;
    }

    const loadModel = async () => {
      try {
        setIsLoading(true);
        console.log('[usePhoneDetection] Loading TensorFlow.js model...');

        // Dynamic imports to avoid SSR issues
        tf = await import('@tensorflow/tfjs');
        const cocoSsdModule = await import('@tensorflow-models/coco-ssd');
        cocoSsd = await cocoSsdModule.load();

        console.log('[usePhoneDetection] Model loaded successfully');
        setModelLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('[usePhoneDetection] Error loading model:', err);
        setError('Failed to load AI model. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadModel();
  }, [isCompatible]);

  // Cleanup alarm timeout on unmount
  useEffect(() => {
    return () => {
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
      }
    };
  }, []);

  // Reset phone detected when detection becomes inactive
  useEffect(() => {
    if (!isActive) {
      setPhoneDetected(false);
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
        alarmTimeoutRef.current = null;
      }
    }
  }, [isActive]);

  // Detect phone in video frame
  const detectPhone = useCallback(
    async (video: HTMLVideoElement): Promise<Prediction[]> => {
      if (!modelLoaded || !cocoSsd || video.readyState !== 4) {
        return [];
      }

      try {
        // Run detection
        const predictions = await cocoSsd.detect(video);

        // Filter for cell phones above confidence threshold
        const phonePredictions = predictions.filter(
          (pred: Prediction) =>
            pred.class === 'cell phone' && pred.score > confidenceThreshold
        );

        // Update detection state
        const now = Date.now();
        const timeSinceLastAlarm = now - lastAlarmTimeRef.current;
        const phoneFound = phonePredictions.length > 0;

        if (
          phoneFound &&
          !phoneDetected &&
          timeSinceLastAlarm >= cooldownPeriod &&
          isActive
        ) {
          console.log('[usePhoneDetection] Phone detected!');
          setPhoneDetected(true);
          setDetectionCount((prev) => prev + 1);
          lastAlarmTimeRef.current = now;

          // Call callback
          if (onPhoneDetected) {
            onPhoneDetected();
          }

          // Clear any existing alarm timeout
          if (alarmTimeoutRef.current) {
            clearTimeout(alarmTimeoutRef.current);
          }

          // Auto-dismiss alarm after duration
          alarmTimeoutRef.current = setTimeout(() => {
            setPhoneDetected(false);
            alarmTimeoutRef.current = null;
          }, alarmDuration);
        }

        return phonePredictions;
      } catch (err) {
        console.error('[usePhoneDetection] Detection error:', err);
        return [];
      }
    },
    [
      modelLoaded,
      phoneDetected,
      confidenceThreshold,
      cooldownPeriod,
      alarmDuration,
      isActive,
      onPhoneDetected,
    ]
  );

  // Draw predictions on canvas
  const drawPredictions = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      predictions: Prediction[],
      canvasWidth: number,
      canvasHeight: number
    ) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw each prediction
      predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;

        // Draw bounding box
        ctx.strokeStyle = '#EF4444'; // red-500
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Draw label background
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(x, y - 30, width, 30);

        // Draw label text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(
          `📱 PHONE ${Math.round(prediction.score * 100)}%`,
          x + 5,
          y - 8
        );
      });
    },
    []
  );

  // Reset detection count
  const resetDetectionCount = useCallback(() => {
    setDetectionCount(0);
  }, []);

  return {
    // Model state
    modelLoaded,
    isLoading,
    error,
    isCompatible,

    // Detection state
    phoneDetected,
    detectionCount,

    // Methods
    detectPhone,
    drawPredictions,
    resetDetectionCount,
  };
}

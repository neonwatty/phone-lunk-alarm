'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Webcam from 'react-webcam'
import { CameraIcon, ArrowPathIcon, StopIcon, ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import AlarmEffect from './AlarmEffect'
import RecordingPreviewModal from './RecordingPreviewModal'
import SoundSelector from './SoundSelector'
import ThemeSelector from './ThemeSelector'
import { useAlarmSound, ALARM_SOUNDS } from '@/hooks/useAlarmSound'
import {
  ALARM_THEMES,
  ThemeKey,
  IntensityLevel,
  loadThemePreference,
  saveThemePreference,
  loadIntensityPreference,
  saveIntensityPreference,
} from '@/lib/alarm-themes'
import { PhoneOverlay } from '@/lib/phone-overlay'
import { trackFunnelEvent } from '@/lib/funnel-events'

import { DETECTOR_MODELS, DETECTOR_PREFERENCE, initialDetectorModel, type DetectorModelId } from '@/lib/detector-models'
import { createLivePhoneDetector, type LivePhoneDetector } from '@/lib/live-phone-detector'

const MAX_RECORDING_DURATION = 30 // seconds

type PhoneDetectorProps = {
  heading?: string
  trackingLocation?: 'demo_page' | 'homepage_demo'
  compact?: boolean
}

export default function PhoneDetector({
  heading = 'Phone Lunk Detector',
  trackingLocation = 'homepage_demo',
  compact = false,
}: PhoneDetectorProps) {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef(new PhoneOverlay())
  const recordingCanvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const [cameraReady, setCameraReady] = useState(false)
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (switchTimerRef.current) clearTimeout(switchTimerRef.current) }, [])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Alarm sound hook
  const {
    selectedSound,
    volume,
    playSound,
    stopSound,
    previewSound,
    changeSound,
    changeVolume,
    toggleMute,
  } = useAlarmSound()

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('classic')
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>('medium')

  // Load theme preferences on mount
  useEffect(() => {
    setSelectedTheme(loadThemePreference())
    setSelectedIntensity(loadIntensityPreference())
  }, [])

  const handleThemeChange = useCallback((theme: ThemeKey) => {
    setSelectedTheme(theme)
    saveThemePreference(theme)
  }, [])

  const handleIntensityChange = useCallback((intensity: IntensityLevel) => {
    setSelectedIntensity(intensity)
    saveIntensityPreference(intensity)
  }, [])

  const [selectedModel, setSelectedModel] = useState<DetectorModelId | null>(null)
  const [loadMessage, setLoadMessage] = useState('Preparing selected model…')
  const [modelAttempt, setModelAttempt] = useState(0)
  const detectorRef = useRef<LivePhoneDetector | null>(null)
  const detectionBusyRef = useRef(false)
  const detectionGenerationRef = useRef(0)
  const cameraActiveRef = useRef(false)
  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem(DETECTOR_PREFERENCE) } catch {}
    setSelectedModel(initialDetectorModel(saved, 'gpu' in navigator))
  }, [])

  const [modelLoaded, setModelLoaded] = useState(false)
  const [phoneDetected, setPhoneDetected] = useState(false)
  const [detectionCount, setDetectionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompatible, setIsCompatible] = useState(true)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAlarmTimeRef = useRef<number>(0)
  const phoneDetectedRef = useRef(false) // For recording canvas access
  const watermarkEnabledRef = useRef(true) // For recording canvas access

  // Watermark state
  const [watermarkEnabled, setWatermarkEnabled] = useState(true)

  // Load watermark preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('phoneLunkWatermarkEnabled')
    const enabled = saved !== 'false' // Default to true
    setWatermarkEnabled(enabled)
    watermarkEnabledRef.current = enabled
  }, [])

  // Sync ref when state changes
  useEffect(() => {
    watermarkEnabledRef.current = watermarkEnabled
    localStorage.setItem('phoneLunkWatermarkEnabled', String(watermarkEnabled))
  }, [watermarkEnabled])

  // Check browser compatibility
  useEffect(() => {
    const checkCompatibility = () => {
      const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      setIsCompatible(hasUserMedia)
    }

    checkCompatibility()
  }, [])

  // Each selection owns its model and cancels obsolete loads/results.
  useEffect(() => {
    if (!selectedModel || !isCompatible) {
      if (!isCompatible) setIsLoading(false)
      return
    }
    const controller = new AbortController()
    const generation = detectionGenerationRef
    let owned: LivePhoneDetector | null = null
    setModelLoaded(false); setIsLoading(true); setError(null); setLoadMessage('Preparing selected model…')
    createLivePhoneDetector(selectedModel, controller.signal, message => {if (!controller.signal.aborted) setLoadMessage(message)}).then(model => {
      if (controller.signal.aborted) { model.dispose(); return }
      owned = model; detectorRef.current = model
      setModelLoaded(true); setIsLoading(false)
    }).catch(err => {
      if (controller.signal.aborted) return
      setError(`Failed to load AI model. ${err instanceof Error ? err.message : 'Select another model or try again.'}`)
      setIsLoading(false)
    })
    return () => {
      controller.abort(); generation.current++
      owned?.dispose()
      if (detectorRef.current === owned) detectorRef.current = null
    }
  }, [selectedModel, isCompatible, modelAttempt])

  const changeModel = (id: DetectorModelId) => {
    setSelectedModel(id)
    try { localStorage.setItem(DETECTOR_PREFERENCE, id) } catch {}
  }

  // Run detection on video frames
  const detectPhone = async () => {
    if (
      detectionBusyRef.current || !cameraActiveRef.current || !detectorRef.current || !modelLoaded ||
      !webcamRef.current ||
      !webcamRef.current.video ||
      !canvasRef.current
    ) {
      return
    }

    const video = webcamRef.current.video
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.readyState !== 4) {
      return
    }

    const generation = detectionGenerationRef.current
    const detector = detectorRef.current
    detectionBusyRef.current = true
    try {
      const predictions = await detector.detect(video)
      if (generation !== detectionGenerationRef.current || !cameraActiveRef.current || detector !== detectorRef.current) return

      overlayRef.current.observe(predictions, performance.now())
      const phoneFound = predictions.some(prediction => prediction.class === 'cell phone')

      // Update detection state
      const now = Date.now()
      const timeSinceLastAlarm = now - lastAlarmTimeRef.current
      const COOLDOWN_PERIOD = 3000 // 3 seconds cooldown after alarm dismisses

      if (phoneFound && !phoneDetectedRef.current && timeSinceLastAlarm >= COOLDOWN_PERIOD) {
        setPhoneDetected(true)
        phoneDetectedRef.current = true
        setDetectionCount((prev) => {
          const next = prev + 1
          trackFunnelEvent('demo_phone_detected', {
            location: trackingLocation,
            detection_count: next,
          })
          return next
        })
        lastAlarmTimeRef.current = now

        // Play alarm sound
        playSound()

        // Clear any existing alarm timeout to prevent overlapping alarms
        if (alarmTimeoutRef.current) {
          clearTimeout(alarmTimeoutRef.current)
        }

        // Auto-dismiss alarm after 5 seconds
        alarmTimeoutRef.current = setTimeout(() => {
          setPhoneDetected(false)
          phoneDetectedRef.current = false
          alarmTimeoutRef.current = null
        }, 5000)
      }
    } catch (err) {
      if (generation === detectionGenerationRef.current && cameraActiveRef.current) {
        setError('Detection stopped. Try again or select another model.'); setIsCameraActive(false); setPhoneDetected(false)
      }
      console.error('Detection error:', err)
    } finally { detectionBusyRef.current = false }
  }

  // Animation frame counter for bouncing effects
  const animationFrameRef = useRef(0)

  // Recording functions
  const drawRecordingFrame = useCallback(() => {
    const video = webcamRef.current?.video
    const detectionCanvas = canvasRef.current
    const recordingCanvas = recordingCanvasRef.current

    if (!video || !detectionCanvas || !recordingCanvas) return

    const ctx = recordingCanvas.getContext('2d')
    if (!ctx) return

    const theme = ALARM_THEMES[selectedTheme]
    const width = video.videoWidth || 640
    const height = video.videoHeight || 480
    const watermarkHeight = 60

    recordingCanvas.width = width
    recordingCanvas.height = height + watermarkHeight

    // Draw watermark banner at top with theme colors
    ctx.fillStyle = theme.primary
    ctx.fillRect(0, 0, width, watermarkHeight)
    ctx.fillStyle = theme.textColor
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🚨 PHONE LUNK DETECTED 🚨  phone-lunk.neonwatty.com', width / 2, watermarkHeight / 2, width - 24)

    // Draw video frame
    ctx.drawImage(video, 0, watermarkHeight, width, height)

    // Draw detection boxes from the detection canvas
    ctx.drawImage(detectionCanvas, 0, watermarkHeight, width, height)

    // If alarm is active, add alarm effects
    if (phoneDetectedRef.current) {
      animationFrameRef.current += 1
      const frame = animationFrameRef.current

      // Parse theme primary color for rgba overlay
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 239, g: 68, b: 68 }
      }
      const rgb = hexToRgb(theme.primary)

      // Pulsing overlay (alternates intensity)
      const pulseIntensity = 0.15 + 0.1 * Math.sin(frame * 0.3)
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pulseIntensity})`
      ctx.fillRect(0, watermarkHeight, width, height)

      // Pulsing border
      const borderWidth = 6 + 2 * Math.sin(frame * 0.3)
      ctx.strokeStyle = theme.primary
      ctx.lineWidth = borderWidth
      ctx.strokeRect(0, watermarkHeight, width, height)

      // Bouncing banner at top of video area
      const bannerBounce = Math.abs(Math.sin(frame * 0.15)) * 20
      const bannerY = watermarkHeight + 30 + bannerBounce
      const bannerWidth = Math.min(400, width * 0.8)
      const bannerHeight = 50
      const bannerX = (width - bannerWidth) / 2

      // Banner background with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetY = 5
      ctx.fillStyle = theme.secondary
      ctx.beginPath()
      ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, 12)
      ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // Banner text
      ctx.fillStyle = theme.textColor
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🚨 PHONE LUNK DETECTED 🚨', width / 2, bannerY + bannerHeight / 2)

      // Big bouncing siren in center
      const sirenBounce = Math.abs(Math.sin(frame * 0.2)) * 30
      const sirenY = watermarkHeight + height / 2 - 40 + sirenBounce
      ctx.font = '80px sans-serif'
      ctx.fillText('🚨', width / 2, sirenY)

      // Corner warning icons (rotating effect simulated with scale pulse)
      const iconScale = 0.8 + 0.2 * Math.sin(frame * 0.1)
      const iconSize = Math.floor(40 * iconScale)
      ctx.font = `${iconSize}px sans-serif`

      const cornerOffset = 30
      // Top-left
      ctx.fillText('⚠️', cornerOffset, watermarkHeight + cornerOffset + 20)
      // Top-right
      ctx.fillText('⚠️', width - cornerOffset, watermarkHeight + cornerOffset + 20)
      // Bottom-left
      ctx.fillText('⚠️', cornerOffset, watermarkHeight + height - cornerOffset)
      // Bottom-right
      ctx.fillText('⚠️', width - cornerOffset, watermarkHeight + height - cornerOffset)
    } else {
      // Reset animation frame when alarm is not active
      animationFrameRef.current = 0
    }

    // Corner watermark (always visible if enabled)
    if (watermarkEnabledRef.current) {
      const padding = 15
      const fontSize = Math.max(14, Math.floor(height * 0.025)) // Proportional to video height

      ctx.save()
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'

      // Shadow for visibility on any background
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      // Semi-transparent white text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.fillText('phone-lunk.neonwatty.com', width - padding, watermarkHeight + height - padding)

      ctx.restore()
    }
  }, [selectedTheme])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      trackFunnelEvent('demo_recording_stop', {
        location: trackingLocation,
        seconds_recorded: recordingTime,
      })
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    setIsRecording(false)
  }, [recordingTime, trackingLocation])

  const startRecording = useCallback(() => {
    const recordingCanvas = recordingCanvasRef.current
    if (!recordingCanvas || !isCameraActive) {
      trackFunnelEvent('demo_recording_blocked', {
        location: trackingLocation,
        reason: isCameraActive ? 'missing_canvas' : 'camera_inactive',
      })
      return
    }

    // Initialize canvas size
    const video = webcamRef.current?.video
    if (video) {
      const width = video.videoWidth || 640
      const height = video.videoHeight || 480
      recordingCanvas.width = width
      recordingCanvas.height = height + 60
    }

    // Get stream from canvas
    const stream = recordingCanvas.captureStream(30) // 30 FPS

    // Create MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4'

    const mediaRecorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = mediaRecorder
    recordedChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      const blob = new Blob(recordedChunksRef.current, { type: mimeType })
      setRecordedBlob(blob)
      setShowPreview(true)
      trackFunnelEvent('demo_recording_complete', {
        location: trackingLocation,
        mime_type: mimeType,
        blob_size: blob.size,
      })
    }

    // Start recording
    mediaRecorder.start(100) // Collect data every 100ms
    setIsRecording(true)
    setRecordingTime(0)
    trackFunnelEvent('demo_recording_start', {
      location: trackingLocation,
      mime_type: mimeType,
    })

    // Start timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_RECORDING_DURATION - 1) {
          stopRecording()
          return prev
        }
        return prev + 1
      })
    }, 1000)

    // Start drawing frames to recording canvas
    const drawLoop = () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        drawRecordingFrame()
        requestAnimationFrame(drawLoop)
      }
    }
    requestAnimationFrame(drawLoop)
  }, [isCameraActive, drawRecordingFrame, stopRecording, trackingLocation])

  const handleClosePreview = () => {
    setShowPreview(false)
    setRecordedBlob(null)
    trackFunnelEvent('demo_recording_preview_close', {
      location: trackingLocation,
    })
  }

  const overlayThemeRef = useRef(selectedTheme)
  overlayThemeRef.current = selectedTheme
  const detectPhoneRef = useRef(detectPhone)
  detectPhoneRef.current = detectPhone

  // Draw independently of inference; canvas resizing clears it, so resize only on
  // resolution changes. Expiration still runs when inference stalls.
  useEffect(() => {
    const overlay = overlayRef.current
    overlay.reset()
    if (!modelLoaded || !isCameraActive) return
    let animation = 0
    const draw = (now: number) => {
      const canvas = canvasRef.current, video = webcamRef.current?.video
      const ctx = canvas?.getContext('2d')
      if (canvas && video && ctx && video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth; canvas.height = video.videoHeight
          overlay.reset()
        }
        ctx.clearRect(0,0,canvas.width,canvas.height)
        const prediction = overlay.frame(now)
        if (prediction) {
          const [x,y,width,height] = prediction.bbox
          const theme = ALARM_THEMES[overlayThemeRef.current]
          ctx.strokeStyle = theme.primary; ctx.lineWidth = 4
          ctx.strokeRect(x,y,width,height)
          ctx.fillStyle = theme.primary
          ctx.fillRect(x,Math.max(0,y-30),width,30)
          ctx.fillStyle = theme.textColor; ctx.font = 'bold 18px sans-serif'
          ctx.fillText('PHONE',x+5,Math.max(22,y-8))
        }
      }
      animation = requestAnimationFrame(draw)
    }
    animation = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animation); overlay.reset() }
  }, [modelLoaded,isCameraActive])

  // Start detection loop when model is loaded AND camera is active
  useEffect(() => {
    const generation = detectionGenerationRef
    cameraActiveRef.current = isCameraActive
    detectorRef.current?.reset()
    if (modelLoaded && isCameraActive) {
      detectionIntervalRef.current = setInterval(() => { void detectPhoneRef.current() }, 100) // Run every 100ms (~10 FPS)
    }

    return () => {
      cameraActiveRef.current = false
      generation.current++
      detectorRef.current?.reset()
      phoneDetectedRef.current = false
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current)
      }
      // Stop recording if active
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [modelLoaded, isCameraActive])

  // Toggle camera on/off
  const toggleCamera = () => {
    stopSound(); setCameraReady(false)
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
    if (isCameraActive) {
      cameraActiveRef.current = false
      detectionGenerationRef.current++
      detectorRef.current?.reset()
      // Stop recording first if active
      if (isRecording) {
        stopRecording()
      }

      // Stop camera
      setIsCameraActive(false)
      setPhoneDetected(false)
      phoneDetectedRef.current = false

      // Clear any active alarm timeout
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current)
        alarmTimeoutRef.current = null
      }

      // Stop the media stream
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
      trackFunnelEvent('demo_camera_stop', {
        location: trackingLocation,
      })
    } else {
      // Start camera
      setError(null) // Clear any previous errors
      setIsCameraActive(true)
      trackFunnelEvent('demo_camera_start', {
        location: trackingLocation,
        facing_mode: facingMode,
      })
    }
  }

  // Retry camera access after error
  const handleRetry = () => {
    setCameraReady(false)
    if (!modelLoaded) { setModelAttempt(attempt => attempt + 1); return }
    setError(null)
    setIsCameraActive(true)
    trackFunnelEvent('demo_camera_retry', {
      location: trackingLocation,
    })
  }

  // Switch between front and back camera
  const handleCameraSwitch = () => {
    stopSound(); setCameraReady(false)
    cameraActiveRef.current = false
    detectionGenerationRef.current++
    detectorRef.current?.reset()
    phoneDetectedRef.current = false
    // Stop current stream
    if (webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }

    // Toggle facing mode
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    trackFunnelEvent('demo_camera_switch', {
      location: trackingLocation,
      from: facingMode,
      to: facingMode === 'user' ? 'environment' : 'user',
    })

    // Clear detection state during switch
    setPhoneDetected(false)

    // Clear any active alarm timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current)
      alarmTimeoutRef.current = null
    }

    // Brief pause to ensure stream stops before restarting
    setIsCameraActive(false)
    switchTimerRef.current = setTimeout(() => {
      setIsCameraActive(true)
      switchTimerRef.current = null
    }, 100)
  }

  return (
    <section id="demo" className="detector-panel max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-6">
        <h2 className={compact ? 'detector-tagline' : 'heading-lg mb-4'} style={{ color: 'var(--color-text-primary)' }}>
          {heading}
        </h2>

        {/* Camera Toggle Button */}
        {!isLoading && !error && isCompatible && (
          <div className="detector-start mt-4">
            <button
              onClick={toggleCamera}
              className="detector-camera-toggle btn-primary text-base px-6 py-3"
              style={{
                background: isCameraActive
                  ? '#b42318'
                  : 'var(--gradient-professional)',
                color: isCameraActive ? '#ffffff' : '#16200f',
              }}
            >
              {isCameraActive ? (
                <>
                  <StopIcon className="w-5 h-5" aria-hidden="true" />
                  Stop Camera
                </>
              ) : (
                <>
                  <CameraIcon className="w-5 h-5" aria-hidden="true" />
                  Start Camera
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Browser compatibility fallback */}
        {!isCompatible && !isLoading && (
          <div className="detector-placeholder rounded-2xl p-8 text-center">

            <p className="text-white text-xl font-bold">
              Camera access is unavailable. Use a browser that supports camera access over HTTPS.
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && isCompatible && (
          <div className="detector-placeholder rounded-2xl p-8 text-center" role="status">
            <ArrowPathIcon className="animate-spin w-8 h-8 mx-auto mb-4" aria-hidden="true" />
            <p className="text-white text-xl">Loading AI model...</p>
            <p className="text-sm mt-2">{loadMessage}</p>
          </div>
        )}

        {/* Error state */}
        {error && isCompatible && (
          <div className="detector-error rounded-2xl p-6 text-left" role="alert">
            <h3 className="font-semibold mb-2">{modelLoaded ? 'Camera unavailable' : 'Model unavailable'}</h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="detector-retry text-base px-6 py-3"
              style={{
                background: 'var(--gradient-professional)',
              }}
            >

              Try Again
            </button>
            {modelLoaded && <button className="detector-other-camera" onClick={() => {setFacingMode(previous => previous === 'user' ? 'environment' : 'user'); handleRetry()}}>Try the other camera</button>}
          </div>
        )}

        {/* Camera placeholder (when camera is off) */}
        {!isLoading && !error && isCompatible && !isCameraActive && (
          <div className="detector-placeholder relative rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="text-center p-6">
              <CameraIcon className="w-9 h-9 mx-auto mb-3" aria-hidden="true" />
              <p className="text-white text-xl font-bold">Camera is off</p>
            </div>
          </div>
        )}

        {/* Webcam and canvas (when camera is active) */}
        {!isLoading && !error && isCompatible && isCameraActive && (
          <div className="detector-camera relative rounded-2xl overflow-hidden">
            <div className="relative">
            {/* Webcam feed */}
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-auto min-h-48"
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: facingMode,
                width: 1280,
                height: 720,
              }}
              onUserMedia={() => setCameraReady(true)}
              onUserMediaError={(err: any) => {
                console.error('Camera error:', err)

                // Parse specific error types
                let errorMessage = 'Camera access failed. Please try again.'

                if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                  errorMessage = 'No camera detected. Connect a camera, then try again.'
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                  errorMessage = 'Camera access denied. Please allow camera access in your browser settings.'
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                  errorMessage = 'Camera is being used by another application. Please close other apps using the camera.'
                } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
                  errorMessage = 'Selected camera mode not available. Choose the other camera below, then try again.'
                }

                stopSound(); setCameraReady(false); setPhoneDetected(false)
                setError(errorMessage)
                setIsCameraActive(false)
                trackFunnelEvent('demo_camera_error', {
                  location: trackingLocation,
                  error_name: err.name || 'unknown',
                })
              }}
            />

            {!cameraReady && <div className="camera-permission-state" role="status"><ArrowPathIcon className="w-7 h-7 animate-spin" aria-hidden="true" /><strong>Waiting for camera access</strong><p>Allow camera access in your browser. You can stop the request at any time.</p></div>}
            {/* Canvas overlay for detection boxes */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />

            {/* Hidden recording canvas */}
            <canvas
              ref={recordingCanvasRef}
              className="hidden"
            />

            </div>
            {/* Status bar */}
            <div className="detector-camera-toolbar flex justify-between items-center gap-2">
              {/* Recording indicator and Sound Settings */}
              <div className="flex flex-col gap-2">
                <div className="bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs sm:text-sm font-semibold">{cameraReady ? 'MONITORING' : 'CONNECTING'}</span>
                </div>
              </div>

              {/* Camera controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Camera switch button */}
                <button
                  disabled={!cameraReady}
                  onClick={handleCameraSwitch}
                  className="detector-switch bg-black bg-opacity-60 px-3 rounded-lg flex items-center gap-2"
                  aria-label={`Switch to ${facingMode === 'user' ? 'rear' : 'front'} camera`}
                  title={`Switch to ${facingMode === 'user' ? 'rear' : 'front'} camera`}
                >
                  <ArrowPathIcon className="text-white w-5 h-5" aria-hidden="true" />
                  <span className="text-white text-xs font-semibold">
                    {facingMode === 'user' ? 'Use rear' : 'Use front'}
                  </span>
                </button>

                {/* Detection counter - hidden on mobile */}
                <div className="hidden sm:block bg-black bg-opacity-60 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white text-sm font-semibold">
                    Detections: {detectionCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom status */}
            <div className="detector-camera-bottom flex justify-between items-center gap-2">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span
                  className={`text-sm font-semibold ${
                    phoneDetected ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {!cameraReady ? 'Camera starting' : phoneDetected ? 'Phone detected' : 'All Clear'}
                </span>
              </div>

              {/* Record Button */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {isRecording && (
                  <div className="bg-black bg-opacity-60 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-mono font-bold">
                      {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                      {(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-gray-400 text-xs">/ 0:30</span>
                  </div>
                )}
                <button
                  disabled={!cameraReady}
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? (
                    <div className="w-5 h-5 bg-white rounded-sm" />
                  ) : (
                    <div className="w-5 h-5 bg-red-600 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="detector-local-note">Camera stays on your device.</p>
      <details className="detector-settings detector-options text-left">
        <summary className="detector-options-summary">
          <span className="settings-label"><AdjustmentsHorizontalIcon aria-hidden="true" />Settings</span>
          <span className="settings-current">{selectedSound === 'none' || volume === 0 ? 'Muted' : `${ALARM_SOUNDS[selectedSound].name} · ${Math.round(volume * 100)}%`}</span>
          <ChevronDownIcon className="settings-chevron" aria-hidden="true" />
        </summary>
        <div className="detector-options-body">
          <SoundSelector selectedSound={selectedSound} volume={volume} onSoundChange={changeSound} onVolumeChange={changeVolume} onPreview={previewSound} onToggleMute={toggleMute} />
          <details className="detector-advanced">
            <summary>Advanced <ChevronDownIcon aria-hidden="true" /></summary>
        <div className="detector-model-card mx-auto mt-4 text-left">
          <label htmlFor="detector-model" className="block font-semibold mb-2">Detection model</label>
          <select id="detector-model" aria-describedby="detector-model-description" value={selectedModel || ''} disabled={isCameraActive} onChange={event => changeModel(event.target.value as DetectorModelId)} className="detector-select w-full min-h-12 p-3 rounded-lg border" style={{background:'var(--color-bg-secondary)',color:'var(--color-text-primary)'}}>
            {!selectedModel && <option value="">Choosing model…</option>}
            {Object.entries(DETECTOR_MODELS).map(([id,model])=><option key={id} value={id}>{model.name}</option>)}
          </select>
          <p id="detector-model-description" className="text-sm mt-2" style={{color:'var(--color-text-secondary)'}}>{selectedModel && DETECTOR_MODELS[selectedModel].description} {isCameraActive && 'Stop the camera to change models.'}</p>
          <Link href="/model-lab/" className="detector-lab-link inline-flex items-center underline text-sm mt-1">Compare models</Link>
        </div>

            <div className="detector-appearance">
              <h3>Visual alert</h3>
              <ThemeSelector selectedTheme={selectedTheme} selectedIntensity={selectedIntensity} onThemeChange={handleThemeChange} onIntensityChange={handleIntensityChange} />
            </div>
          </details>
        </div>
      </details>

      {/* Global alarm effect */}
      <AlarmEffect active={phoneDetected} theme={selectedTheme} intensity={selectedIntensity} />

      {/* Recording Preview Modal */}
      {showPreview && recordedBlob && (
        <RecordingPreviewModal
          videoBlob={recordedBlob}
          onClose={handleClosePreview}
        />
      )}
    </section>
  )
}

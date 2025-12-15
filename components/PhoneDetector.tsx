'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'
import AlarmEffect from './AlarmEffect'
import RecordingPreviewModal from './RecordingPreviewModal'

// We'll load TensorFlow dynamically to avoid SSR issues
let cocoSsd: any = null
let tf: any = null

const MAX_RECORDING_DURATION = 30 // seconds

export default function PhoneDetector() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recordingCanvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Check browser compatibility
  useEffect(() => {
    const checkCompatibility = () => {
      const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      const hasWebGL = (() => {
        try {
          const canvas = document.createElement('canvas')
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        } catch (e) {
          return false
        }
      })()

      setIsCompatible(hasUserMedia && hasWebGL)
    }

    checkCompatibility()
  }, [])

  // Load the model
  useEffect(() => {
    if (!isCompatible) {
      setIsLoading(false)
      return
    }

    const loadModel = async () => {
      try {
        setIsLoading(true)
        // Dynamic imports to avoid SSR issues
        tf = await import('@tensorflow/tfjs')
        const cocoSsdModule = await import('@tensorflow-models/coco-ssd')
        cocoSsd = await cocoSsdModule.load()
        setModelLoaded(true)
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading model:', err)
        setError('Failed to load AI model. Please refresh the page.')
        setIsLoading(false)
      }
    }

    loadModel()
  }, [isCompatible])

  // Run detection on video frames
  const detectPhone = async () => {
    if (
      !modelLoaded ||
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

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    try {
      // Run detection
      const predictions = await cocoSsd.detect(video)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Check for cell phone detection
      let phoneFound = false

      predictions.forEach((prediction: any) => {
        if (prediction.class === 'cell phone' && prediction.score > 0.35) {
          phoneFound = true

          // Draw bounding box
          const [x, y, width, height] = prediction.bbox
          ctx.strokeStyle = '#EF4444' // red-500
          ctx.lineWidth = 4
          ctx.strokeRect(x, y, width, height)

          // Draw label background
          ctx.fillStyle = '#EF4444'
          ctx.fillRect(x, y - 30, width, 30)

          // Draw label text
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 18px sans-serif'
          ctx.fillText(
            `📱 PHONE ${Math.round(prediction.score * 100)}%`,
            x + 5,
            y - 8
          )
        }
      })

      // Update detection state
      const now = Date.now()
      const timeSinceLastAlarm = now - lastAlarmTimeRef.current
      const COOLDOWN_PERIOD = 3000 // 3 seconds cooldown after alarm dismisses

      if (phoneFound && !phoneDetected && timeSinceLastAlarm >= COOLDOWN_PERIOD) {
        setPhoneDetected(true)
        phoneDetectedRef.current = true
        setDetectionCount((prev) => prev + 1)
        lastAlarmTimeRef.current = now

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
      console.error('Detection error:', err)
    }
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

    const width = video.videoWidth || 640
    const height = video.videoHeight || 480
    const watermarkHeight = 60

    recordingCanvas.width = width
    recordingCanvas.height = height + watermarkHeight

    // Draw watermark banner at top
    ctx.fillStyle = '#EF4444' // Red
    ctx.fillRect(0, 0, width, watermarkHeight)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🚨 PHONE LUNK DETECTED 🚨  phone-lunk.app', width / 2, watermarkHeight / 2)

    // Draw video frame
    ctx.drawImage(video, 0, watermarkHeight, width, height)

    // Draw detection boxes from the detection canvas
    ctx.drawImage(detectionCanvas, 0, watermarkHeight, width, height)

    // If alarm is active, add alarm effects
    if (phoneDetectedRef.current) {
      animationFrameRef.current += 1
      const frame = animationFrameRef.current

      // Pulsing red overlay (alternates intensity)
      const pulseIntensity = 0.15 + 0.1 * Math.sin(frame * 0.3)
      ctx.fillStyle = `rgba(239, 68, 68, ${pulseIntensity})`
      ctx.fillRect(0, watermarkHeight, width, height)

      // Pulsing border
      const borderWidth = 6 + 2 * Math.sin(frame * 0.3)
      ctx.strokeStyle = '#EF4444'
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
      ctx.fillStyle = '#DC2626'
      ctx.beginPath()
      ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, 12)
      ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // Banner text
      ctx.fillStyle = '#FFFFFF'
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
  }, [])

  const startRecording = useCallback(() => {
    const recordingCanvas = recordingCanvasRef.current
    if (!recordingCanvas || !isCameraActive) return

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
      const blob = new Blob(recordedChunksRef.current, { type: mimeType })
      setRecordedBlob(blob)
      setShowPreview(true)
    }

    // Start recording
    mediaRecorder.start(100) // Collect data every 100ms
    setIsRecording(true)
    setRecordingTime(0)

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
  }, [isCameraActive, drawRecordingFrame])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    setIsRecording(false)
  }, [])

  const handleClosePreview = () => {
    setShowPreview(false)
    setRecordedBlob(null)
  }

  // Start detection loop when model is loaded AND camera is active
  useEffect(() => {
    if (modelLoaded && isCameraActive) {
      detectionIntervalRef.current = setInterval(detectPhone, 100) // Run every 100ms (~10 FPS)
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current)
      }
      // Stop recording if active
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelLoaded, isCameraActive])

  // Toggle camera on/off
  const toggleCamera = () => {
    if (isCameraActive) {
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
    } else {
      // Start camera
      setError(null) // Clear any previous errors
      setIsCameraActive(true)
    }
  }

  // Retry camera access after error
  const handleRetry = () => {
    setError(null)
    setIsCameraActive(true)
  }

  // Switch between front and back camera
  const handleCameraSwitch = () => {
    // Stop current stream
    if (webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }

    // Toggle facing mode
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')

    // Clear detection state during switch
    setPhoneDetected(false)

    // Clear any active alarm timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current)
      alarmTimeoutRef.current = null
    }

    // Brief pause to ensure stream stops before restarting
    setIsCameraActive(false)
    setTimeout(() => {
      setIsCameraActive(true)
    }, 100)
  }

  return (
    <section id="demo" className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="heading-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Be The Alarm
        </h2>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-base md:text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Gym doesn't have Phone-Lunk yet? Take matters into your own hands
          </p>
          <ol className="text-left space-y-3 text-base md:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <li className="flex items-start gap-3">
              <span className="font-bold text-xl" style={{ color: 'var(--color-accent-primary)' }}>1.</span>
              <span><strong style={{ color: 'var(--color-text-primary)' }}>Allow camera access</strong> to activate vigilante mode</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-xl" style={{ color: 'var(--color-accent-primary)' }}>2.</span>
              <span><strong style={{ color: 'var(--color-text-primary)' }}>Spot a phone-lunk</strong> scrolling between sets</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-xl" style={{ color: 'var(--color-accent-primary)' }}>3.</span>
              <span><strong style={{ color: 'var(--color-text-primary)' }}>Whip out your phone</strong>, point, and put them on blast</span>
            </li>
          </ol>
        </div>

        <div className="inline-block bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 mb-4">
          ⚠️ Your camera feed stays private - all processing happens in your browser
        </div>

        {/* Camera Toggle Button */}
        {!isLoading && !error && isCompatible && (
          <div className="mt-6">
            <button
              onClick={toggleCamera}
              className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: isCameraActive
                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  : 'var(--gradient-professional)',
                transform: 'scale(1)',
              }}
            >
              {isCameraActive ? (
                <>
                  <span className="inline-block mr-2">🛑</span>
                  Stop Camera
                </>
              ) : (
                <>
                  <span className="inline-block mr-2">📷</span>
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
          <div className="bg-gray-800 rounded-2xl p-12 text-center border-2 border-purple-500">
            <p className="text-white text-2xl mb-2">😜</p>
            <p className="text-white text-xl font-bold">
              If you were using a better browser you would see the demo here
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && isCompatible && (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-white text-xl">Loading AI model...</p>
            <p className="text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {/* Error state */}
        {error && isCompatible && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-xl mb-4">⚠️ {error}</p>
            <button
              onClick={handleRetry}
              className="btn-primary text-base px-6 py-3"
              style={{
                background: 'var(--gradient-professional)',
              }}
            >
              <span className="inline-block mr-2">🔄</span>
              Try Again
            </button>
          </div>
        )}

        {/* Camera placeholder (when camera is off) */}
        {!isLoading && !error && isCompatible && !isCameraActive && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800 aspect-video flex items-center justify-center">
            <div className="text-center p-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-white text-xl font-bold mb-2">Camera is off</p>
              <p className="text-gray-400">Click "Start Camera" to begin detection</p>
            </div>
          </div>
        )}

        {/* Webcam and canvas (when camera is active) */}
        {!isLoading && !error && isCompatible && isCameraActive && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Webcam feed */}
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-auto"
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: facingMode,
                width: 1280,
                height: 720,
              }}
              onUserMediaError={(err: any) => {
                console.error('Camera error:', err)

                // Parse specific error types
                let errorMessage = 'Camera access failed. Please try again.'

                if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                  errorMessage = 'No camera detected. This demo requires a webcam.'
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                  errorMessage = 'Camera access denied. Please allow camera access in your browser settings.'
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                  errorMessage = 'Camera is being used by another application. Please close other apps using the camera.'
                } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
                  errorMessage = 'Selected camera mode not available. Try switching cameras.'
                }

                setError(errorMessage)
                setIsCameraActive(false)
              }}
            />

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

            {/* Status bar */}
            <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              {/* Recording indicator */}
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-xs sm:text-sm font-semibold">MONITORING</span>
              </div>

              {/* Camera controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Camera switch button */}
                <button
                  onClick={handleCameraSwitch}
                  className="bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-opacity-80 transition-all duration-300 flex items-center gap-1.5 sm:gap-2"
                  title={`Switch to ${facingMode === 'user' ? 'rear' : 'front'} camera`}
                >
                  <span className="text-white text-base sm:text-lg">{facingMode === 'user' ? '🤳' : '📱'}</span>
                  <span className="text-white text-xs font-semibold">
                    {facingMode === 'user' ? 'Front' : 'Rear'}
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
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span
                  className={`text-sm font-semibold ${
                    phoneDetected ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {phoneDetected ? '⚠️ PHONE DETECTED' : '✓ All Clear'}
                </span>
              </div>

              {/* Record Button */}
              <div className="flex items-center gap-3">
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
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-white hover:bg-gray-100'
                  }`}
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

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Instant Justice
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Real-time phone detection
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">📱</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              On-The-Go
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Your personal enforcement tool
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              No Escape
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              AI-powered detection
            </div>
          </div>
        </div>
      </div>

      {/* Global alarm effect */}
      <AlarmEffect active={phoneDetected} />

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

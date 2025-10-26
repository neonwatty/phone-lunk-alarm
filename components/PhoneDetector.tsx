'use client'

import { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import AlarmEffect from './AlarmEffect'

// We'll load TensorFlow dynamically to avoid SSR issues
let cocoSsd: any = null
let tf: any = null

export default function PhoneDetector() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [phoneDetected, setPhoneDetected] = useState(false)
  const [detectionCount, setDetectionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load the model
  useEffect(() => {
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
  }, [])

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
        if (prediction.class === 'cell phone' && prediction.score > 0.5) {
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
      if (phoneFound && !phoneDetected) {
        setPhoneDetected(true)
        setDetectionCount((prev) => prev + 1)
        // Auto-dismiss alarm after 2 seconds
        setTimeout(() => setPhoneDetected(false), 2000)
      } else if (!phoneFound && phoneDetected) {
        setPhoneDetected(false)
      }
    } catch (err) {
      console.error('Detection error:', err)
    }
  }

  // Start detection loop when model is loaded
  useEffect(() => {
    if (modelLoaded) {
      detectionIntervalRef.current = setInterval(detectPhone, 200) // Run every 200ms (~5 FPS)
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelLoaded, phoneDetected])

  return (
    <section id="demo" className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="heading-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Try It Yourself
        </h2>
        <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Tired of waiting for equipment while someone camps on it scrolling? This is for you. Hold up your phone and watch the alarm trigger.
        </p>
        <div className="inline-block bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400">
          ⚠️ Your camera feed stays private - all processing happens in your browser
        </div>
      </div>

      <div className="relative">
        {/* Loading state */}
        {isLoading && (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-white text-xl">Loading AI model...</p>
            <p className="text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-xl mb-2">⚠️ {error}</p>
          </div>
        )}

        {/* Webcam and canvas */}
        {!isLoading && !error && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Webcam feed */}
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-auto"
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'user',
                width: 1280,
                height: 720,
              }}
              onUserMediaError={(err) => {
                console.error('Camera error:', err)
                setError('Camera access denied. Please allow camera access and refresh.')
              }}
            />

            {/* Canvas overlay for detection boxes */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />

            {/* Status bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              {/* Recording indicator */}
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-semibold">MONITORING</span>
              </div>

              {/* Detection counter */}
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-white text-sm font-semibold">
                  Detections: {detectionCount}
                </span>
              </div>
            </div>

            {/* Bottom status */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span
                  className={`text-sm font-semibold ${
                    phoneDetected ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {phoneDetected ? '⚠️ PHONE DETECTED' : '✓ All Clear'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Real-Time Detection
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Runs at ~5 FPS for smooth performance
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Privacy First
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              All processing in-browser, no uploads
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🧠</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              COCO-SSD Model
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Trained on millions of images
            </div>
          </div>
        </div>
      </div>

      {/* Global alarm effect */}
      <AlarmEffect active={phoneDetected} />
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { CameraIcon } from '@heroicons/react/24/outline'
import { DETECTOR_MODELS, DETECTOR_PREFERENCE, initialDetectorModel, type DetectorModelId } from '@/lib/detector-models'
import { createLivePhoneDetector, type LivePhoneDetector } from '@/lib/live-phone-detector'
import { PhoneOverlay } from '@/lib/phone-overlay'
import { nextVideoFrame } from '@/lib/next-video-frame'
import type { PhoneBox } from '@/lib/clip-tracking'

const clipUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/examples/phone-lunk-1.mp4`

function waitForPlayback(video: HTMLVideoElement, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener('play', ready)
      document.removeEventListener('visibilitychange', ready)
      signal.removeEventListener('abort', abort)
    }
    const ready = () => { if (!video.paused && !document.hidden) { cleanup(); resolve() } }
    const abort = () => { cleanup(); reject(new DOMException('Cancelled','AbortError')) }
    video.addEventListener('play', ready)
    document.addEventListener('visibilitychange', ready)
    signal.addEventListener('abort', abort, {once:true})
    if (signal.aborted) abort(); else ready()
  })
}

export default function VideoMockup() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [box, setBox] = useState<PhoneBox | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [modelId, setModelId] = useState<DetectorModelId | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const video = videoRef.current!
    const controller = new AbortController()
    const { signal } = controller
    const overlay = new PhoneOverlay()
    let model: LivePhoneDetector | undefined
    let animation = 0
    let generation = 0
    let previousTime = -1
    let saved: string | null = null
    try { saved = localStorage.getItem(DETECTOR_PREFERENCE) } catch {}
    const id = initialDetectorModel(saved, 'gpu' in navigator)
    setModelId(id); setStatus('loading'); setBox(null)
    const reset = () => { generation++; overlay.reset(); model?.reset(); setBox(null) }
    const failed = () => { reset(); setStatus('error'); controller.abort(); model?.dispose() }
    video.addEventListener('pause',reset)
    video.addEventListener('seeking',reset)
    video.addEventListener('error',failed)
    document.addEventListener('visibilitychange',reset)

    const draw = (now: number) => {
      if (signal.aborted) return
      if (video.currentTime < previousTime) reset()
      previousTime = video.currentTime
      const p = !video.paused && !document.hidden ? overlay.frame(now) : null
      setBox(p && video.videoWidth && video.videoHeight ? {
        x:p.bbox[0]/video.videoWidth*100, y:p.bbox[1]/video.videoHeight*100,
        width:p.bbox[2]/video.videoWidth*100, height:p.bbox[3]/video.videoHeight*100, score:p.score,
      } : null)
      animation = requestAnimationFrame(draw)
    }
    async function run() {
      try {
        model = await createLivePhoneDetector(id,signal)
        if (signal.aborted) return
        setStatus('ready')
        animation = requestAnimationFrame(draw)
        while (!signal.aborted) {
          await waitForPlayback(video,signal)
          try { await nextVideoFrame(video,signal) }
          catch(error) { if (!signal.aborted && (video.paused || document.hidden)) continue; throw error }
          if (video.paused || document.hidden) continue
          const current = generation
          const sourceTime = video.currentTime
          const predictions = await model.detect(video)
          if (signal.aborted) return
          if (current === generation && video.currentTime >= sourceTime && !video.paused && !document.hidden) {
            overlay.observe(predictions,performance.now())
          }
        }
      } catch(error) {
        if (!signal.aborted) { console.error('Example phone detection failed',error); setStatus('error') }
      } finally {
        cancelAnimationFrame(animation); overlay.reset(); setBox(null)
        model?.dispose(); model=undefined
      }
    }
    void run()
    return () => {
      controller.abort(); cancelAnimationFrame(animation); model?.dispose()
      video.removeEventListener('pause',reset)
      video.removeEventListener('seeking',reset)
      video.removeEventListener('error',failed)
      document.removeEventListener('visibilitychange',reset)
    }
  }, [attempt])

  return (
    <figure className="detector-preview" aria-label="Live phone detection on recorded footage">
      <div className="preview-top"><span><CameraIcon /> Phone Lunk</span><span className="preview-label">LIVE DETECTION</span></div>
      <div className="preview-viewfinder">
        <video ref={videoRef} autoPlay loop muted playsInline controls width={480} height={270}
          src={clipUrl} aria-label="A person using a phone in a gym" className="preview-footage"
          />
        {box && <div className="preview-detection" style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.width}%`, height: `${box.height}%` }}>
          <span>PHONE DETECTED</span>
        </div>}
      </div>
      <div className="preview-status"><div className="preview-sound"><CameraIcon /></div><div>
        <strong>{status === 'loading' ? 'Loading detector…' : status === 'error' ? 'Detection unavailable' : box ? 'Phone detected' : 'No phone detected'}</strong>
        <p>{status === 'error' ? 'Could not run the detector. Try again.' : status === 'ready' ? 'Live detection with camera smoothing' : 'Loading on your device. First load may take a minute.'}</p>
      </div>{status === 'error' && <button className="preview-retry" onClick={() => setAttempt(a => a + 1)}>Retry</button>}</div>
      <figcaption>{modelId ? DETECTOR_MODELS[modelId].name : 'On-device detection'} · Recorded footage · Sound off</figcaption>
    </figure>
  )
}

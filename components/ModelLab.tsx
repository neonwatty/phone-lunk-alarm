'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { loadPhoneModel, type PhoneModelOptions } from '@/lib/phone-model'
import { updatePhoneTrack, type PhoneTrack } from '@/lib/phone-tracking'
import { createLivePhoneDetector, type LivePhoneDetector } from '@/lib/live-phone-detector'
import { PhoneOverlay } from '@/lib/phone-overlay'
import { nextVideoFrame } from '@/lib/next-video-frame'
import { validateGpuClip } from '@/lib/validate-gpu-clip'
import benchmark from '@/lib/model-benchmark.json'

type Measurement = { ms: number; tracked: boolean; strong: boolean; time: number }
const names: Record<string, string> = {
  'r50-fp32': 'R50 · FP32 (baseline)', 'r50-q8': 'R50 · INT8', 'r18-fp32': 'R18 · FP32', 'r18-q8': 'R18 · INT8',
  'r18-o365-fp32': 'R18 Objects365 · FP32', 'r18-o365-q8': 'R18 Objects365 · INT8', 'r34-q8': 'R34 · INT8',
}
function percentile(values: number[], fraction: number) {
  const sorted = [...values].sort((a,b) => a-b)
  return sorted.length ? sorted[Math.min(sorted.length-1, Math.ceil(sorted.length*fraction)-1)] : 0
}

export default function ModelLab() {
  const [validation, setValidation] = useState<Awaited<ReturnType<typeof validateGpuClip>> | null>(null)
  const [selected, setSelected] = useState('r18-o365-fp32')
  const [device, setDevice] = useState<'wasm' | 'webgpu'>('webgpu')
  const [mode, setMode] = useState<'full' | 'combined'>('full')
  const [status, setStatus] = useState('Ready to test')
  const [running, setRunning] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [overlayStatus, setOverlayStatus] = useState('No box')
  const [paused, setPaused] = useState(false)
  const [continuous, setContinuous] = useState(false)
  const pausedRef = useRef(false)
  const smoothCanvasRef = useRef<HTMLCanvasElement>(null)
  const [label, setLabel] = useState('No frame analyzed yet')
  const [history, setHistory] = useState<{ name: string; median: number; p95: number; hits: number; strong: number; count: number }[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const modelRef = useRef<{ dispose(): void } | null>(null)
  useEffect(() => () => { abortRef.current?.abort(); modelRef.current?.dispose() }, [])
  const stop = () => { abortRef.current?.abort(); modelRef.current?.dispose(); modelRef.current = null }

  async function validate() {
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true); setValidation(null)
    try {
      const results = await validateGpuClip(controller.signal, setStatus)
      setValidation(results)
      setStatus(results.every(r=>r.pass) ? 'GPU parity passed: nine clip frames and blank negative' : 'GPU parity failed: inspect comparison results')
    } catch(error) { setStatus(controller.signal.aborted ? 'Stopped' : `Validation failed: ${String(error)}`) }
    finally { setRunning(false) }
  }

  async function run() {
    const video = videoRef.current
    if (!video || video.readyState < 2) { setStatus('Wait for the video to load, then try again.'); return }
    const controller = new AbortController()
    abortRef.current = controller
    const candidate = benchmark.reports.find(r => r.key === selected)!
    const sessionName = `${names[selected]} / ${mode === 'full' ? 'one pass' : 'two passes'} / ${device}`
    const recorded: Measurement[] = []
    const overlay = new PhoneOverlay()
    let animation = 0
    let hasFreshDetection = false
    let lastObservation = -Infinity
    let lastPlaybackTime = -1
    let stoppedForVisibility = false
    pausedRef.current = false; setPaused(false)
    const usesCameraAdapter = selected === 'r18-o365-fp32' && device === 'webgpu' && mode === 'full'
    let detector: Awaited<ReturnType<typeof loadPhoneModel>> | LivePhoneDetector | null = null
    setRunning(true); setMeasurements([]); setStatus('Loading model…'); setLabel('Loading detector…')
    try {
      await video.play()
      detector = usesCameraAdapter ? await createLivePhoneDetector('r18-gpu', controller.signal) : await loadPhoneModel(controller.signal, { modelId: candidate.modelId, dtype: candidate.dtype as PhoneModelOptions['dtype'], mode, device })
      modelRef.current = detector
      if (controller.signal.aborted) return
      const frame = document.createElement('canvas')
      frame.width = video.videoWidth; frame.height = video.videoHeight
      const context = frame.getContext('2d', { willReadFrequently: true })!
      let track: PhoneTrack | null = null
      let previousSourceTime = -1
      let measuredStart = 0
      const drawOverlay = (now: number) => {
        const canvas = smoothCanvasRef.current, output = canvas?.getContext('2d')
        if (video.currentTime < lastPlaybackTime) overlay.reset()
        lastPlaybackTime = video.currentTime
        if (canvas && output) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth; canvas.height = video.videoHeight
          }
          output.clearRect(0,0,canvas.width,canvas.height)
          const p = overlay.frame(now)
          if (p) { output.strokeStyle='#c4ed97'; output.lineWidth=2; output.strokeRect(...p.bbox) }
          setOverlayStatus(p ? (hasFreshDetection && now-lastObservation < 150 && !pausedRef.current ? 'Tracking' : 'Brief hold') : 'No box')
        }
        animation = requestAnimationFrame(drawOverlay)
      }
      animation = requestAnimationFrame(drawOverlay)
      setStatus('Running live inference · at least 15 seconds and 20 frames after warmup')
      for (let i=0; !controller.signal.aborted && (continuous || i<21 || performance.now()-measuredStart<15000); i++) {
        if (document.hidden) { stoppedForVisibility = true; setStatus('Test stopped because the tab was hidden.'); break }
        const time = await nextVideoFrame(video, controller.signal)
        if (pausedRef.current) { i--; continue }
        context.drawImage(video,0,0,frame.width,frame.height)
        if (time < previousSourceTime && 'reset' in detector && typeof detector.reset === 'function') detector.reset()
        const start = performance.now()
        const predictions = await detector.detect(frame)
        const ms = performance.now()-start
        if (controller.signal.aborted) break
        // Clip time wraps; track age must use elapsed real time.
        if (time < previousSourceTime) track = null
        track = updatePhoneTrack(predictions, track, start / 1000)
        previousSourceTime = time
        const p = usesCameraAdapter ? predictions[0] : track?.prediction
        // Never paint a result from before a playback loop onto the new loop.
        if (video.currentTime >= time) {
          lastObservation = performance.now(); hasFreshDetection = !!p
          overlay.observe(p ? [p] : [], lastObservation)
        }
        const canvas=canvasRef.current, output=canvas?.getContext('2d')
        if (canvas && output) {
          canvas.width=frame.width; canvas.height=frame.height
          output.drawImage(frame,0,0)
          if(p){ output.strokeStyle='#c4ed97';output.lineWidth=2;output.strokeRect(...p.bbox) }
        }
        setLabel(p ? `Phone detected · score ${p.score.toFixed(2)} · source ${time.toFixed(2)}s` : `No accepted phone track · source ${time.toFixed(2)}s`)
        if (i === 0) measuredStart = performance.now()
        if(i>0) { recorded.push({ms,tracked:!!p,strong:predictions.some(p=>p.class==='cell phone'&&p.score>=.4),time});setMeasurements([...recorded]) }
      }
      if (!controller.signal.aborted && !stoppedForVisibility && recorded.length >= 20 && performance.now()-measuredStart >= 15000) setStatus('Run complete')
    } catch(error) {
      if (!controller.signal.aborted) setStatus(`Test failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      cancelAnimationFrame(animation); overlay.reset(); setOverlayStatus('No box')
      const canvas = smoothCanvasRef.current
      if (canvas) canvas.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height)
      pausedRef.current=false; setPaused(false)
      detector?.dispose();modelRef.current=null
      if(recorded.length) setHistory(previous=>[...previous,{name:sessionName,median:percentile(recorded.map(r=>r.ms),.5),p95:percentile(recorded.map(r=>r.ms),.95),hits:recorded.filter(r=>r.tracked).length,strong:recorded.filter(r=>r.strong).length,count:recorded.length}])
      setRunning(false)
      if(controller.signal.aborted)setStatus('Stopped')
    }
  }

  const median=percentile(measurements.map(m=>m.ms),.5)
  return <div className="landing model-lab"><div className="lab-width">
    <header className="lab-header"><Link href="/">← Phone Lunk</Link><span>MODEL COMPARISON</span></header>
    <h1>A smaller detector.<br />Speed and detection coverage.</h1>
    <a className="landing-launch" href="#live-check">Review live smoothing ↓</a>
    <p className="lab-intro">Compare model size, phone-detection coverage, and actual processing speed on the gym clip. This page tests recorded frames—not your camera.</p>
    <section className="lab-card"><h2>Initial screening · nine frames</h2>
      <p>Same clip and thresholds: 0.40 to acquire, 0.18 to continue a nearby track. Coverage counts accepted phone tracks; it is not a general accuracy score. Confirm the box visually in the live check below.</p>
      <div className="lab-table-wrap"><table><thead><tr><th>Model</th><th>Weights</th><th>Frames ≥ 0.40</th><th>Tracked frames</th><th>CPU median</th></tr></thead><tbody>
        {benchmark.reports.map(r=><tr key={r.key} className={r.key==='r18-o365-q8'?'lab-best':''}><th>{names[r.key]}</th><td>{(r.weightBytes/1e6).toFixed(1)} MB</td><td>{r.full.rawHits} / {r.full.total}</td><td>{r.full.trackedHits} / {r.full.total}</td><td>{Math.round(r.full.medianMs)} ms</td></tr>)}
      </tbody></table></div>
      <p className="lab-note">All rows use one full-frame pass. Node / ONNX Runtime on {benchmark.cpu}; model loading and warmup excluded. Browser and phone timings will differ. The earlier R50 two-pass preview scored {benchmark.reports[0].combined.trackedHits}/9 at {Math.round(benchmark.reports[0].combined.medianMs)} ms.</p>
    </section>
    <section className="lab-card"><h2>Local results</h2>
      <p>The 21.7 MB R18 Objects365 INT8 model tracked 44 of 45 decoded frames, acquiring on the second frame. Its 82.6 MB FP32 version tracked 45 of 45. Only 11 and 19 frames respectively reached the acquisition threshold independently.</p>
      <div className="lab-table-wrap"><table><caption>Earlier desktop runs · WebAssembly · 20 measured frames</caption><thead><tr><th>Model / input</th><th>Median</th><th>P95</th></tr></thead><tbody>{benchmark.browser.map(r=><tr key={r.name}><th>{r.name}</th><td>{r.medianMs} ms</td><td>{r.p95Ms} ms</td></tr>)}</tbody></table></div>
      <h2>GPU compatibility fixed · FP32</h2>
      <p>The verified 82.5 MB export runs on WebGPU. It matches the CPU phone boxes on nine identical clip samples and keeps the blank negative clear. The INT8 GPU export failed numerical validation and is disabled.</p>
      <div className="lab-table-wrap"><table><caption>Updated runtime · distinct source frames · full-frame pass</caption><thead><tr><th>Model / runtime</th><th>Median</th><th>P95</th><th>Tracked</th></tr></thead><tbody>{benchmark.gpuFollowup.map(r=><tr key={r.name}><th>{r.name}</th><td>{r.medianMs} ms</td><td>{r.p95Ms} ms</td><td>{r.tracked}/{r.total}</td></tr>)}</tbody></table></div>
      <p>The GPU keeps up with this 10 fps clip across repeated loops. Phone performance and broader detection accuracy still require testing. Each GPU run spans at least 15 seconds; model loading is excluded.</p>
      <p className="lab-note">Measured October 15, 2026, on Apple M5 Max. One recorded gym clip and a blank negative control; this does not establish general accuracy. Runtime downloads and model loading are excluded from frame timing.</p>
    </section>
    <section className="lab-card" id="live-check"><h2>Live browser check</h2><p>Inference runs continuously in a worker. The left panel uses the camera’s smoothing on live playback. The right panel shows fresh detections on the exact analyzed frame. No precomputed boxes. R18 Objects365 FP32 with WebGPU and one pass uses the same detector adapter as the camera.</p>
      <div className="lab-controls"><label>Model<select value={selected} disabled={running} onChange={e=>setSelected(e.target.value)}>{benchmark.reports.map(r=><option key={r.key} value={r.key}>{names[r.key]}</option>)}</select></label><label>Input<select value={mode} disabled={running} onChange={e=>setMode(e.target.value as typeof mode)}><option value="full">Full frame · one pass</option><option value="combined">Full frame + center crop · two passes</option></select></label>
      <label>Runtime<select value={device} disabled={running} onChange={e=>setDevice(e.target.value as typeof device)}><option value="webgpu">WebGPU</option><option value="wasm">WebAssembly · CPU</option></select></label>
      <button className="landing-launch" disabled={running} onClick={run}>Run live check</button>{running&&<button className="lab-stop" onClick={stop}>Stop</button>}</div>
      <div className="lab-controls">
        <label><span>Preview duration</span><select value={continuous ? 'continuous' : 'benchmark'} disabled={running} onChange={e=>setContinuous(e.target.value === 'continuous')}><option value="benchmark">15-second benchmark</option><option value="continuous">Keep running until stopped</option></select></label>
        {running && <button className="lab-stop" onClick={()=>{pausedRef.current=!pausedRef.current;setPaused(pausedRef.current)}}>{paused ? 'Resume detections' : 'Pause detections'}</button>}
      </div>
      <p>Smoothed display: {overlayStatus}{paused ? ' · Detections paused' : ''}. Smoothing eases movement and holds the last box for at most 250 ms. Pause detections to check that the box expires.</p>
      <button className="lab-stop" disabled={running} onClick={validate}>Validate FP32 GPU against CPU</button>
      <p role="status">{status}</p>
      {validation && <details open><summary>Identical-frame parity results · IoU ≥ 0.80, score difference ≤ 0.03, same acquisition decision</summary><pre style={{overflowX:'auto',maxHeight:300,fontSize:11}}>{JSON.stringify(validation,null,2)}</pre></details>}
      <div className="lab-videos"><figure><div className="lab-smooth-preview"><video ref={videoRef} src={`${process.env.NEXT_PUBLIC_BASE_PATH||''}/images/examples/phone-lunk-1.mp4`} autoPlay muted loop playsInline controls={!running} width="480" height="270" /><canvas ref={smoothCanvasRef} width="480" height="270" aria-label="Smoothed phone tracking on live playback" /></div><figcaption>Smoothed live playback · 10 source frames / sec</figcaption></figure><figure><canvas ref={canvasRef} width="480" height="270" aria-label="Latest analyzed frame with model detection box" /><figcaption>{label}</figcaption></figure></div>
      <div className="lab-metrics"><div><strong>{median ? `${Math.round(median)} ms`:'—'}</strong><span>Median frame processing</span></div><div><strong>{median?(1000/median).toFixed(1):'—'}</strong><span>Inference capacity / sec</span></div><div><strong>{measurements.filter(m=>m.tracked).length} / {measurements.length}</strong><span>Live sampled frames with a track</span></div></div>
      <p className="lab-note">Runtime for next run: {device === 'wasm' ? 'WebAssembly, one thread' : 'WebGPU'}. GPU testing requires the locally prepared FP32 export (see SETUP.md). This is the current computer—not an iPhone benchmark. A phone trial is still required. Each new source frame is sampled once; inference capacity excludes waiting for the 10 fps clip. Coverage counts fresh detections only; a briefly held display box never increases detection coverage. The raw panel retains the last analyzed frame after a run, while the live overlay clears.</p>
      {history.length>0&&<div className="lab-table-wrap"><table><caption>Runs in this browser session</caption><thead><tr><th>Run</th><th>Median</th><th>P95</th><th>Frames ≥ 0.40</th><th>Tracked</th></tr></thead><tbody>{history.map((h,i)=><tr key={i}><th>{h.name}</th><td>{Math.round(h.median)} ms</td><td>{Math.round(h.p95)} ms</td><td>{h.strong}/{h.count}</td><td>{h.hits}/{h.count}</td></tr>)}</tbody></table></div>}
    </section>
    <footer className="lab-footer">Local research preview · no camera access · no frame uploads</footer>
  </div></div>
}

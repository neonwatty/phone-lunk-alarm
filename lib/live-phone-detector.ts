import { VERIFIED_PHONE_MODEL, type DetectorModelId } from './detector-models'
import { updatePhoneTrack, type PhonePrediction, type PhoneTrack } from './phone-tracking'

export type LivePhoneDetector = { detect(video: HTMLVideoElement | HTMLCanvasElement): Promise<PhonePrediction[]>; reset(): void; dispose(): void }

export async function createLivePhoneDetector(id: DetectorModelId, signal: AbortSignal, onProgress?: (message: string) => void): Promise<LivePhoneDetector> {
  if (id === 'r18-gpu') {
    if (!('gpu' in navigator)) throw new Error('WebGPU is unavailable. Select Standard detection or use a browser with WebGPU support.')
    const { loadPhoneModel } = await import('./phone-model')
    const model = await (onProgress ? loadPhoneModel(signal, VERIFIED_PHONE_MODEL, onProgress) : loadPhoneModel(signal, VERIFIED_PHONE_MODEL))
    const frame = document.createElement('canvas')
    const context = frame.getContext('2d', { willReadFrequently: true })!
    let track: PhoneTrack | null = null
    let generation = 0
    return {
      async detect(video) {
        const current = generation
        frame.width = 'videoWidth' in video ? video.videoWidth : video.width
        frame.height = 'videoHeight' in video ? video.videoHeight : video.height
        context.drawImage(video, 0, 0)
        const capturedAt = performance.now() / 1000
        const predictions = await model.detect(frame)
        if (current !== generation) return []
        const matched = updatePhoneTrack(predictions, track, capturedAt)
        // Keep association briefly through a miss, but return only fresh evidence.
        track = matched ?? (track && capturedAt-track.time <= .25 ? track : null)
        return matched ? [matched.prediction] : []
      },
      reset() { generation++; track = null },
      dispose() { generation++; track = null; model.dispose() },
    }
  }
  await import('@tensorflow/tfjs')
  const coco = await import('@tensorflow-models/coco-ssd')
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
  const model = await coco.load()
  if (signal.aborted) { model.dispose(); throw new DOMException('Cancelled', 'AbortError') }
  return {
    async detect(video) { return (await model.detect(video)).filter(p => p.class === 'cell phone' && p.score > .35) },
    reset() {},
    dispose() { model.dispose() },
  }
}

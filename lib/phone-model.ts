import type { PhonePrediction } from './phone-tracking'

export type PhoneModelOptions = { modelId?: string; dtype?: 'fp32' | 'q8'; mode?: 'full' | 'crop' | 'combined'; device?: 'wasm' | 'webgpu' }

// Keep the large model and inference off the UI thread.
export async function loadPhoneModel(signal?: AbortSignal, options: PhoneModelOptions = {}) {
  const worker = new Worker(new URL('./phone-detection.worker.ts', import.meta.url))
  let resolveResult: ((predictions: PhonePrediction[]) => void) | null = null
  let rejectResult: ((error: Error) => void) | null = null
  let disposed = false
  await new Promise<void>((resolve, reject) => {
    const abort = () => { worker.terminate(); reject(new DOMException('Cancelled', 'AbortError')) }
    if (signal?.aborted) { abort(); return }
    signal?.addEventListener('abort', abort, { once: true })
    worker.onerror = event => { worker.terminate(); reject(new Error(event.message || 'Detector worker failed')) }
    worker.onmessage = event => {
      if (event.data.type === 'ready') { signal?.removeEventListener('abort', abort); resolve() }
      if (event.data.type === 'error') { worker.terminate(); reject(new Error(event.data.message)) }
    }
    worker.postMessage({ type: 'load', options })
  })
  worker.onerror = event => { rejectResult?.(new Error(event.message || 'Detector worker failed')); resolveResult = null; rejectResult = null }
  worker.onmessage = event => {
    if (event.data.type === 'result') resolveResult?.(event.data.predictions)
    else if (event.data.type === 'error') rejectResult?.(new Error(event.data.message))
    resolveResult = null
    rejectResult = null
  }
  return {
    detect(frame: HTMLCanvasElement): Promise<PhonePrediction[]> {
      if (disposed) return Promise.reject(new Error('Detector disposed'))
      if (resolveResult) return Promise.reject(new Error('Inference already in progress'))
      const data = frame.getContext('2d')?.getImageData(0, 0, frame.width, frame.height)
      if (!data) return Promise.reject(new Error('Frame unavailable'))
      return new Promise((resolve, reject) => {
        resolveResult = resolve
        rejectResult = reject
        worker.postMessage({ type: 'detect', frame: data }, [data.data.buffer])
      })
    },
    dispose() {
      disposed = true
      rejectResult?.(new Error('Detector disposed'))
      resolveResult = null
      rejectResult = null
      worker.terminate()
    },
  }
}

import type { PhonePrediction } from './phone-tracking'
import type { PhoneModelOptions } from './phone-model'

const PHONE_MODEL_ID = 'onnx-community/rtdetr_r50vd'

export async function loadPhoneModel(options: PhoneModelOptions = {}) {
  const { pipeline, RawImage, env } = await import('@huggingface/transformers')
  env.allowLocalModels = false
  env.backends.onnx.wasm!.numThreads = 1
  // Must match the pinned runtime override; Transformers.js otherwise loads its older WASM binary.
  env.backends.onnx.wasm!.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/'
  const useGpuExport = options.device === 'webgpu' && options.modelId === 'onnx-community/rtdetr_r18vd_coco_o365'
  if (useGpuExport && options.dtype === 'q8') throw new Error('INT8 GPU export failed parity validation. Select R18 Objects365 FP32 for the verified GPU export.')
  if (useGpuExport) {
    env.allowLocalModels = true
    env.allowRemoteModels = false
    env.localModelPath = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/models/`
  }
  const detector = await pipeline('object-detection', useGpuExport ? 'r18-o365-gpu' : options.modelId || PHONE_MODEL_ID, { dtype: options.dtype || 'fp32', device: options.device || 'wasm' })
  return {
    async detect(frame: ImageData): Promise<PhonePrediction[]> {
      const image = new RawImage(frame.data, frame.width, frame.height, 4)
      const regions = [
        { image, x: 0, y: 0 },
        { image: await image.crop([Math.round(image.width * .3), Math.round(image.height * .2), Math.round(image.width * .7), Math.round(image.height * .8)]), x: Math.round(image.width * .3), y: Math.round(image.height * .2) },
      ]
      const phones: PhonePrediction[] = []
      const selected = options.mode === 'full' ? regions.slice(0, 1) : options.mode === 'crop' ? regions.slice(1) : regions
      for (const region of selected) {
        const output = await detector(region.image, { threshold: .18 })
        for (const p of output.flat()) {
          if (p.label !== 'cell phone') continue
          phones.push({ class: p.label, score: p.score, bbox: [region.x + p.box.xmin, region.y + p.box.ymin, p.box.xmax - p.box.xmin, p.box.ymax - p.box.ymin] })
        }
      }
      return phones
    },
    dispose: () => detector.dispose(),
  }
}

let detector: Awaited<ReturnType<typeof loadPhoneModel>>
const scope = self as unknown as { onmessage: (event: MessageEvent) => void; postMessage: (message: unknown) => void }
scope.onmessage = async event => {
  try {
    if (event.data.type === 'load') {
      detector = await loadPhoneModel(event.data.options)
      scope.postMessage({ type: 'ready' })
    } else if (event.data.type === 'detect') {
      const predictions = await detector.detect(event.data.frame)
      scope.postMessage({ type: 'result', predictions })
    }
  } catch (error) {
    scope.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) })
  }
}

import type { PhoneModelOptions } from './phone-model'

// Stable IDs keep saved choices independent of a platform's inference runtime.
export const DETECTOR_MODELS = {
  'r18-gpu': { name: 'Phone detection · GPU', description: '82.5 MB · Requires WebGPU. Validated on the example clip.', requiresGpu: true },
  'coco-ssd': { name: 'Standard detection', description: 'COCO-SSD · Broader browser support. May miss small or partly hidden phones.', requiresGpu: false },
} as const
export type DetectorModelId = keyof typeof DETECTOR_MODELS
export const DETECTOR_PREFERENCE = 'phoneLunkDetectorModel'
export const VERIFIED_PHONE_MODEL: PhoneModelOptions = {
  modelId: 'onnx-community/rtdetr_r18vd_coco_o365', dtype: 'fp32', mode: 'full', device: 'webgpu',
}
export function initialDetectorModel(saved: string | null, hasGpu: boolean): DetectorModelId {
  if (saved && Object.hasOwn(DETECTOR_MODELS, saved)) return saved as DetectorModelId
  return hasGpu ? 'r18-gpu' : 'coco-ssd'
}

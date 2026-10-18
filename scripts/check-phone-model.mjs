// Usage: node scripts/check-phone-model.mjs /path/to/frames [output.json]
// Extract comparable samples with: ffmpeg -i clip.mp4 -vf fps=2 frame-%02d.png
import { pipeline, RawImage, env } from '@huggingface/transformers'
import fs from 'node:fs/promises'
import path from 'node:path'

const directory = process.argv[2]
if (!directory) throw new Error('Pass a directory of extracted PNG frames')
if (process.env.PHONE_MODEL_CACHE) env.cacheDir = process.env.PHONE_MODEL_CACHE
const modelId = 'onnx-community/rtdetr_r50vd'
const detector = await pipeline('object-detection', modelId, { dtype: 'fp32' })
const results = []
try {
  for (const file of (await fs.readdir(directory)).filter(f => f.endsWith('.png')).sort()) {
    const image = await RawImage.read(path.join(directory, file))
    const x = Math.round(image.width * .3), y = Math.round(image.height * .2)
    const crop = await image.crop([x, y, Math.round(image.width * .7), Math.round(image.height * .8)])
    const full = await detector(image, { threshold: .18 })
    const close = await detector(crop, { threshold: .18 })
    const phones = [
      ...full.flat(),
      ...close.flat().map(p => ({ ...p, box: { xmin: p.box.xmin + x, ymin: p.box.ymin + y, xmax: p.box.xmax + x, ymax: p.box.ymax + y } })),
    ].filter(p => p.label === 'cell phone').sort((a, b) => b.score - a.score)
    const result = { file, phones }
    results.push(result)
    console.log(JSON.stringify({ file, strongest: phones[0] || null }))
  }
  if (process.argv[3]) await fs.writeFile(process.argv[3], JSON.stringify({ modelId, dtype: 'fp32', results }, null, 2))
} finally {
  await detector.dispose()
}

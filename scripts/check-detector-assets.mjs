import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const root = new URL('../public/models/r18-o365-gpu/', import.meta.url)
try {
  for (const name of ['config.json', 'preprocessor_config.json']) JSON.parse(await readFile(new URL(name, root), 'utf8'))
  const bytes = await readFile(new URL('onnx/model.onnx', root))
  if (createHash('sha256').update(bytes).digest('hex') !== 'e4b37345cda3fb4c5bea926cfe03c955522c51d9e557ef1c54a77e3b84c6124e') throw new Error('Unverified GPU model export')
} catch (error) {
  console.error('Detector assets missing or unverified. Run python scripts/prepare-gpu-model.py first.', error.message)
  process.exit(1)
}

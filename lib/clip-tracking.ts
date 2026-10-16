export type PhoneBox = { x: number; y: number; width: number; height: number; score: number }
export type ClipSample = { time: number; box: PhoneBox | null }

// Interpolate only between two real, accepted detections. Never bridge a miss.
export function boxAtTime(samples: ClipSample[], time: number): PhoneBox | null {
  if (!samples.length || !Number.isFinite(time)) return null
  const nextIndex = samples.findIndex(sample => sample.time > time)
  if (nextIndex === 0) return samples[0].box
  if (nextIndex === -1) return samples[samples.length - 1].box
  const left = samples[nextIndex - 1], right = samples[nextIndex]
  if (!left.box || !right.box) return null
  const fraction = (time - left.time) / (right.time - left.time)
  const mix = (a: number, b: number) => a + (b - a) * fraction
  return {
    x: mix(left.box.x, right.box.x), y: mix(left.box.y, right.box.y),
    width: mix(left.box.width, right.box.width), height: mix(left.box.height, right.box.height),
    score: Math.min(left.box.score, right.box.score),
  }
}

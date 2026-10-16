export type PhonePrediction = { bbox: [number, number, number, number]; score: number; class: string }
export type PhoneTrack = { prediction: PhonePrediction; time: number }

function overlap(a: PhonePrediction['bbox'], b: PhonePrediction['bbox']) {
  const x = Math.max(a[0], b[0]), y = Math.max(a[1], b[1])
  const intersection = Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - x) * Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - y)
  return intersection / (a[2] * a[3] + b[2] * b[3] - intersection || 1)
}

function nearby(a: PhonePrediction['bbox'], b: PhonePrediction['bbox']) {
  const distance = Math.hypot(a[0] + a[2] / 2 - b[0] - b[2] / 2, a[1] + a[3] / 2 - b[1] - b[3] / 2)
  const scale = Math.max(b[2], b[3])
  const areaRatio = (a[2] * a[3]) / (b[2] * b[3])
  return distance <= scale && areaRatio >= .4 && areaRatio <= 2.5
}

// A weaker prediction may update an existing track, never initiate one.
// Missing predictions clear the visible box; no fabricated or held coordinates.
export function updatePhoneTrack(predictions: PhonePrediction[], previous: PhoneTrack | null, time: number): PhoneTrack | null {
  const phones = predictions.filter(p => p.class === 'cell phone' && p.bbox.every(Number.isFinite) && p.bbox[2] > 0 && p.bbox[3] > 0)
  const fresh = phones.filter(p => p.score >= .4).sort((a,b) => b.score - a.score)[0]
  if (fresh) return { prediction: fresh, time }
  if (!previous || time < previous.time || time - previous.time > 1) return null
  const matched = phones.filter(p => p.score >= .18 && (overlap(p.bbox, previous.prediction.bbox) >= .2 || nearby(p.bbox, previous.prediction.bbox))).sort((a,b) => b.score - a.score)[0]
  return matched ? { prediction: matched, time } : null
}

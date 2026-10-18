import type { PhonePrediction } from './phone-tracking'

// Presentation only: held boxes must never be used as alarm/detection evidence.
export const OVERLAY_HOLD_MS = 250
export class PhoneOverlay {
  private target: PhonePrediction | null = null
  private box: PhonePrediction['bbox'] | null = null
  private observedAt = -Infinity
  private renderedAt = 0

  reset() { this.target = null; this.box = null; this.observedAt = -Infinity }

  observe(predictions: PhonePrediction[], now: number) {
    const next = predictions.filter(p => p.class === 'cell phone' && Number.isFinite(p.score) && p.bbox.every(Number.isFinite) && p.bbox[2] > 0 && p.bbox[3] > 0).sort((a,b) => b.score-a.score)[0]
    if (!next) return // Do not extend the hold on missing evidence.
    const old = this.target?.bbox
    const distance = old ? Math.hypot(next.bbox[0]+next.bbox[2]/2-old[0]-old[2]/2, next.bbox[1]+next.bbox[3]/2-old[1]-old[3]/2) : Infinity
    if (!old || now-this.observedAt > OVERLAY_HOLD_MS || now < this.observedAt || distance > Math.max(old[2],old[3])) {
      this.box = [...next.bbox]
      this.renderedAt = now
    }
    this.target = {...next, bbox:[...next.bbox]}
    this.observedAt = now
  }

  frame(now: number): PhonePrediction | null {
    if (!this.target || !this.box) return null
    if (now-this.observedAt > OVERLAY_HOLD_MS || now < this.observedAt) { this.reset(); return null }
    // Time-based easing behaves consistently on 60/120 Hz screens.
    const alpha = 1-Math.exp(-Math.max(0,now-this.renderedAt)/70)
    this.box = this.box.map((value,index) => value+(this.target!.bbox[index]-value)*alpha) as PhonePrediction['bbox']
    this.renderedAt = now
    return {...this.target,bbox:[...this.box]}
  }
}

import { PhoneOverlay } from '@/lib/phone-overlay'
import type { PhonePrediction } from '@/lib/phone-tracking'
const phone = (x=100): PhonePrediction => ({class:'cell phone',score:.8,bbox:[x,100,40,80]})
it('bridges short misses without extending a stale box indefinitely', () => {
  const overlay = new PhoneOverlay()
  overlay.observe([phone()],0)
  overlay.observe([],100)
  expect(overlay.frame(200)?.bbox[0]).toBe(100)
  overlay.observe([],240)
  expect(overlay.frame(251)).toBeNull()
  expect(overlay.frame(1000)).toBeNull() // Also expires when inference stops.
})
it('eases jitter but snaps to a different phone instead of sweeping across the scene', () => {
  const overlay = new PhoneOverlay()
  overlay.observe([phone()],0)
  overlay.frame(0)
  overlay.observe([phone(110)],100)
  const box = overlay.frame(100)!
  expect(box.bbox[0]).toBeGreaterThan(100)
  expect(box.bbox[0]).toBeLessThan(110)
  overlay.observe([phone(400)],150)
  expect(overlay.frame(150)?.bbox[0]).toBe(400)
})
it('clears immediately on stop/reset and never starts without detection evidence', () => {
  const overlay = new PhoneOverlay()
  overlay.observe([],0)
  expect(overlay.frame(0)).toBeNull()
  overlay.observe([phone()],1)
  overlay.reset()
  expect(overlay.frame(2)).toBeNull()
})

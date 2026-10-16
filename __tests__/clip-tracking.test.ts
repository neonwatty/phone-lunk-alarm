import { boxAtTime, type PhoneBox } from '@/lib/clip-tracking'
const box: PhoneBox = { x: 10, y: 20, width: 5, height: 4, score: .7 }
it('interpolates movement between real detections at playback time', () => {
  const samples = [{ time: 0, box }, { time: 1, box: { ...box, x: 20 } }]
  expect(boxAtTime(samples, .5)?.x).toBe(15)
  expect(boxAtTime(samples, 0)?.x).toBe(10)
})
it('never interpolates across a miss and rewinds with playback', () => {
  const samples = [{ time: .25, box }, { time: .75, box: null }]
  expect(boxAtTime(samples, .5)).toBeNull()
  expect(boxAtTime(samples, 1)).toBeNull()
  expect(boxAtTime(samples, 0)?.x).toBe(10)
  expect(boxAtTime([], 0)).toBeNull()
})

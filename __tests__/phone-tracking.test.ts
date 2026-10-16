import { updatePhoneTrack, type PhonePrediction } from '@/lib/phone-tracking'
const phone = (score: number, x = 100): PhonePrediction => ({ class: 'cell phone', score, bbox: [x, 100, 20, 10] })
it('requires strong evidence to start, then follows overlapping weaker detections', () => {
  expect(updatePhoneTrack([phone(.2)], null, 0)).toBeNull()
  const initial = updatePhoneTrack([phone(.6)], null, 0)
  const moved = updatePhoneTrack([phone(.25, 104)], initial, .3)
  expect(moved?.prediction.bbox[0]).toBe(104)
})
it('clears on missing evidence, expiration, loop rewind, or an unrelated weak detection', () => {
  const initial = updatePhoneTrack([phone(.6)], null, 2)
  expect(updatePhoneTrack([], initial, 2.2)).toBeNull()
  expect(updatePhoneTrack([phone(.25)], initial, 3.1)).toBeNull()
  expect(updatePhoneTrack([phone(.25)], initial, .1)).toBeNull()
  expect(updatePhoneTrack([phone(.25, 300)], initial, 2.2)).toBeNull()
})
it('rejects wrong classes and invalid geometry', () => {
  expect(updatePhoneTrack([{ ...phone(.9), class: 'person' }], null, 0)).toBeNull()
  expect(updatePhoneTrack([{ ...phone(.9), bbox: [NaN, 0, 5, 5] }], null, 0)).toBeNull()
})

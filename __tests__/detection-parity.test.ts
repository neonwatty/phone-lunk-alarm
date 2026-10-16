import { comparePhonePredictions } from '../lib/detection-parity'
import type { PhonePrediction } from '../lib/phone-tracking'
const phone = (score=.5, x=10): PhonePrediction => ({class:'cell phone',score,bbox:[x,10,20,10]})
test('accepts small GPU numeric drift and blank negatives',()=>{
 expect(comparePhonePredictions([phone()],[phone(.501)]).pass).toBe(true)
 expect(comparePhonePredictions([],[]).pass).toBe(true)
})
test('rejects missing detections, new false positives, shifted boxes and threshold crossings',()=>{
 expect(comparePhonePredictions([phone()],[]).pass).toBe(false)
 expect(comparePhonePredictions([],[phone()]).pass).toBe(false)
 expect(comparePhonePredictions([phone()],[phone(.5,50)]).pass).toBe(false)
 expect(comparePhonePredictions([phone(.401)],[phone(.399)]).pass).toBe(false)
 expect(comparePhonePredictions([phone()],[phone(.6)]).pass).toBe(false)
})

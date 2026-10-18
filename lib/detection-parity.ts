import type { PhonePrediction } from './phone-tracking'

// Compare the strongest phone on identical frames, allowing small GPU float error.
export function comparePhonePredictions(cpu: PhonePrediction[], gpu: PhonePrediction[]) {
  const strongest = (items: PhonePrediction[]) => items.filter(p => p.class === 'cell phone').sort((a,b) => b.score-a.score)[0]
  const a = strongest(cpu), b = strongest(gpu)
  if (!a || !b) return { pass: !a && !b, iou: null, scoreDifference: null }
  const [ax,ay,aw,ah]=a.bbox, [bx,by,bw,bh]=b.bbox
  const intersection=Math.max(0,Math.min(ax+aw,bx+bw)-Math.max(ax,bx))*Math.max(0,Math.min(ay+ah,by+bh)-Math.max(ay,by))
  const iou=intersection/(aw*ah+bw*bh-intersection)
  const scoreDifference=Math.abs(a.score-b.score)
  return { pass: iou>=.8 && scoreDifference<=.03 && (a.score>=.4)===(b.score>=.4), iou, scoreDifference }
}

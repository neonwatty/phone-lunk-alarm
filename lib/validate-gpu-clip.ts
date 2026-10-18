import { loadPhoneModel } from './phone-model'
import { comparePhonePredictions } from './detection-parity'
import type { PhonePrediction } from './phone-tracking'

function waitForVideo(video: HTMLVideoElement, event: string, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); video.removeEventListener(event, ready); video.removeEventListener('error', failed); signal.removeEventListener('abort', aborted) }
    const ready = () => { cleanup(); resolve() }
    const failed = () => { cleanup(); reject(new Error('Could not decode comparison footage')) }
    const aborted = () => { cleanup(); reject(new DOMException('Cancelled', 'AbortError')) }
    const timer = setTimeout(failed, 15000)
    video.addEventListener(event, ready, { once:true });video.addEventListener('error', failed, {once:true});signal.addEventListener('abort', aborted,{once:true})
    if(signal.aborted)aborted()
  })
}

export async function validateGpuClip(signal: AbortSignal, progress: (text:string)=>void) {
  const video=document.createElement('video');video.muted=true;video.playsInline=true
  let url=''
  try {
    const response=await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH||''}/images/examples/phone-lunk-1.mp4`,{signal})
    if(!response.ok)throw new Error('Could not load comparison footage')
    url=URL.createObjectURL(await response.blob())
    const ready=waitForVideo(video,'loadeddata',signal);video.src=url;video.load();await ready
    const frames: HTMLCanvasElement[]=[]
    for(let i=0;i<9;i++) {
      const time=(i+.5)*video.duration/9
      const seeked=waitForVideo(video,'seeked',signal);video.currentTime=time;await seeked
      if(Math.abs(video.currentTime-time)>.1)throw new Error('Comparison video seek failed')
      const frame=document.createElement('canvas');frame.width=video.videoWidth;frame.height=video.videoHeight
      frame.getContext('2d')!.drawImage(video,0,0);frames.push(frame)
    }
    const blank=document.createElement('canvas');blank.width=480;blank.height=270
    const context=blank.getContext('2d')!;context.fillStyle='#808080';context.fillRect(0,0,480,270);frames.push(blank)
    const outputs: PhonePrediction[][][]=[]
    for(const device of ['wasm','webgpu'] as const) {
      progress(`Loading ${device} for identical-frame comparison…`)
      const detector=await loadPhoneModel(signal,{modelId:'onnx-community/rtdetr_r18vd_coco_o365',dtype:'fp32',mode:'full',device})
      const abort=()=>detector.dispose();signal.addEventListener('abort',abort,{once:true})
      try {
        if(signal.aborted)throw new DOMException('Cancelled','AbortError')
        const predictions=[]
        for(let i=0;i<frames.length;i++) {progress(`Validating ${device} · ${i+1}/10`);predictions.push(await detector.detect(frames[i]))}
        outputs.push(predictions)
      } finally {signal.removeEventListener('abort',abort);detector.dispose()}
    }
    return frames.map((_,i)=>({frame:i===9?'Blank negative':`Clip sample ${i+1}`, ...comparePhonePredictions(outputs[0][i],outputs[1][i]), cpu:outputs[0][i],gpu:outputs[1][i]}))
  } finally {video.removeAttribute('src');video.load();if(url)URL.revokeObjectURL(url)}
}

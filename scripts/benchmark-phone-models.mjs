import { pipeline, RawImage, env } from '@huggingface/transformers'
import ts from 'typescript'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
const trackingSource = await fs.readFile(new URL('../lib/phone-tracking.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(trackingSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { updatePhoneTrack } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
const framesDir = process.argv[2] || '/tmp/phone-lunk-model-check'
const sampleFps = Number(process.env.SAMPLE_FPS || 2)
const output = process.argv[3] || '/tmp/phone-lunk-small-models/results.json'
env.cacheDir = process.env.PHONE_MODEL_CACHE || '/tmp/phone-lunk-model-check/cache'
const candidates = [
 ['yolov10n-fp32','yolov10n','fp32'],
 ['r50-fp32','rtdetr_r50vd','fp32'],
 ['r50-q8','rtdetr_r50vd','q8'],
 ['r18-fp32','rtdetr_r18vd','fp32'],
 ['r18-q8','rtdetr_r18vd','q8'],
 ['r18-o365-fp32','rtdetr_r18vd_coco_o365','fp32'],
 ['r18-o365-q8','rtdetr_r18vd_coco_o365','q8'],
 ['r34-q8','rtdetr_r34vd','q8'],
]
const files=(await fs.readdir(framesDir)).filter(f=>/^frame-.*\.png$/.test(f)).sort()
const images=await Promise.all(files.map(file=>RawImage.read(path.join(framesDir,file))))
const reports=[]
for (const [key,name,dtype] of candidates) {
 if(process.env.CANDIDATE && key!==process.env.CANDIDATE)continue
 let detector
 try {
 const modelId='onnx-community/'+name
 const started=performance.now()
 detector=await pipeline('object-detection',modelId,{dtype})
 const loadMs=performance.now()-started
 const infer=async image => (await detector(image,{threshold:.18})).flat().filter(p=>p.label==='cell phone').map(p=>({class:p.label,score:p.score,bbox:[p.box.xmin,p.box.ymin,p.box.xmax-p.box.xmin,p.box.ymax-p.box.ymin]}))
 await infer(images[0]) // warmup excluded
 const full=[],crop=[],combined=[]
 for(let i=0;i<images.length;i++) {
  const image=images[i], x=Math.round(image.width*.3),y=Math.round(image.height*.2)
  let start=performance.now();const f=await infer(image);const fullMs=performance.now()-start
  start=performance.now();const c=await infer(await image.crop([x,y,Math.round(image.width*.7),Math.round(image.height*.8)]));const cropMs=performance.now()-start
  const mapped=c.map(p=>({...p,bbox:[p.bbox[0]+x,p.bbox[1]+y,p.bbox[2],p.bbox[3]]}))
  full.push({file:files[i],ms:fullMs,predictions:f})
  crop.push({file:files[i],ms:cropMs,predictions:mapped})
  combined.push({file:files[i],ms:fullMs+cropMs,predictions:[...f,...mapped]})
 }
 const summarize=frames=>{
  let track=null;let tracks=0
  for(let i=0;i<frames.length;i++){ track=updatePhoneTrack(frames[i].predictions,track,(i+.5)/sampleFps); if(track)tracks++ }
  const times=frames.map(f=>f.ms).sort((a,b)=>a-b)
  return {rawHits:frames.filter(f=>f.predictions.some(p=>p.score>=.4)).length,trackedHits:tracks,total:frames.length,medianMs:times[Math.floor(times.length/2)],p95Ms:times[Math.ceil(times.length*.95)-1],frames}
 }
 const blank=new RawImage(new Uint8ClampedArray(480*270*3).fill(127),480,270,3)
 const negatives=await infer(blank)
 const file=path.join(env.cacheDir,modelId,'onnx',dtype==='q8'?'model_quantized.onnx':'model.onnx')
 const weightBytes=(await fs.stat(file)).size
 const report={key,modelId,dtype,weightBytes,loadMs,full:summarize(full),crop:summarize(crop),combined:summarize(combined),blankPredictions:negatives}
 reports.push(report)
 console.log(JSON.stringify({key,mb:weightBytes/1e6,full:{hits:report.full.rawHits,tracked:report.full.trackedHits,ms:report.full.medianMs},crop:{hits:report.crop.rawHits,tracked:report.crop.trackedHits,ms:report.crop.medianMs},combined:{hits:report.combined.rawHits,tracked:report.combined.trackedHits,ms:report.combined.medianMs}}))
 }catch(e){reports.push({key,error:String(e)});console.error(key,e)}finally{await detector?.dispose()}
 await fs.writeFile(output,JSON.stringify({runtime:'Node ONNX Runtime CPU (not browser or phone)',cpu:os.cpus()[0].model,platform:os.platform(),generatedAt:new Date().toISOString(),sampleFps,reports},null,2))
}

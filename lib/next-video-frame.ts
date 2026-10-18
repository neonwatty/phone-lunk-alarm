// Measure each decoded source frame at most once, including at loop boundaries.
export function nextVideoFrame(video: HTMLVideoElement, signal: AbortSignal) {
  return new Promise<number>((resolve,reject)=>{
    if(signal.aborted){reject(new DOMException('Cancelled','AbortError'));return}
    let callback = 0
    const cleanup=()=>{clearTimeout(timer);video.cancelVideoFrameCallback(callback);signal.removeEventListener('abort',abort)}
    const abort=()=>{cleanup();reject(new DOMException('Cancelled','AbortError'))}
    const timer=setTimeout(()=>{cleanup();reject(new Error('Video playback stopped producing frames'))},5000)
    signal.addEventListener('abort',abort,{once:true})
    callback=video.requestVideoFrameCallback((_now,metadata)=>{cleanup();resolve(metadata.mediaTime)})
  })
}

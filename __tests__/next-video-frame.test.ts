import { nextVideoFrame } from '../lib/next-video-frame'

test('waits for decoded frames and returns source timestamp', async()=>{
 const video=document.createElement('video')
 let ready: VideoFrameRequestCallback=()=>{}
 video.requestVideoFrameCallback=jest.fn(callback=>{ready=callback;return 7})
 video.cancelVideoFrameCallback=jest.fn()
 const result=nextVideoFrame(video,new AbortController().signal)
 ready(10,{mediaTime:1.2} as VideoFrameCallbackMetadata)
 await expect(result).resolves.toBe(1.2)
 expect(video.cancelVideoFrameCallback).toHaveBeenCalledWith(7)
})
test('stop cancels pending video callbacks',async()=>{
 const video=document.createElement('video')
 video.requestVideoFrameCallback=jest.fn(()=>9)
 video.cancelVideoFrameCallback=jest.fn()
 const controller=new AbortController()
 const result=nextVideoFrame(video,controller.signal)
 controller.abort()
 await expect(result).rejects.toMatchObject({name:'AbortError'})
 expect(video.cancelVideoFrameCallback).toHaveBeenCalledWith(9)
})

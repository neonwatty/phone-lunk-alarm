import { render, screen, act } from '@testing-library/react'
import VideoMockup from '@/components/VideoMockup'

const mockDetect = jest.fn()
const mockDispose = jest.fn()
const mockReset = jest.fn()
let nextFrame: () => void
jest.mock('@/lib/live-phone-detector', () => ({
  createLivePhoneDetector: jest.fn(async () => ({detect:mockDetect,dispose:mockDispose,reset:mockReset})),
}))
jest.mock('@/lib/next-video-frame', () => ({
  nextVideoFrame: (_video: HTMLVideoElement, signal: AbortSignal) => new Promise<number>((resolve,reject) => {
    const abort = () => reject(new DOMException('Cancelled','AbortError'))
    signal.addEventListener('abort',abort,{once:true})
    nextFrame = () => {signal.removeEventListener('abort',abort);resolve(0)}
  }),
}))
beforeEach(() => {
  jest.clearAllMocks(); jest.useFakeTimers(); localStorage.clear()
  jest.spyOn(HTMLMediaElement.prototype,'paused','get').mockReturnValue(false)
  Object.defineProperty(HTMLVideoElement.prototype,'videoWidth',{configurable:true,value:480})
  Object.defineProperty(HTMLVideoElement.prototype,'videoHeight',{configurable:true,value:270})
})
afterEach(() => {jest.useRealTimers();jest.restoreAllMocks()})
const phone = {class:'cell phone',score:.8,bbox:[240,135,48,27]}
async function frame() {await act(async()=>{nextFrame()});await act(async()=>{jest.advanceTimersByTime(16)})}

it('runs live inference repeatedly, smooths its box, and releases the detector on leaving', async()=>{
  mockDetect.mockResolvedValue([phone])
  const view = render(<VideoMockup />)
  await screen.findByText('No phone detected')
  await frame()
  expect(view.container.querySelector('.preview-detection')).toHaveStyle({left:'50%',top:'50%',width:'10%',height:'10%'})
  await frame()
  expect(mockDetect).toHaveBeenCalledTimes(2)
  expect(mockDispose).not.toHaveBeenCalled()
  view.unmount()
  expect(mockDispose).toHaveBeenCalled()
})
it('expires the display after missing evidence, independently of inference', async()=>{
  mockDetect.mockResolvedValueOnce([phone]).mockResolvedValue([])
  const view = render(<VideoMockup />)
  await screen.findByText('No phone detected')
  await frame(); await frame()
  expect(view.container.querySelector('.preview-detection')).not.toBeNull()
  await act(async()=>{jest.advanceTimersByTime(300)})
  expect(view.container.querySelector('.preview-detection')).toBeNull()
})
it('clears on seeking and ignores inference started before the seek', async()=>{
  let finish!: (value: unknown[])=>void
  mockDetect.mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve}))
  const view=render(<VideoMockup />)
  await screen.findByText('No phone detected')
  await act(async()=>{nextFrame()})
  act(()=>{view.container.querySelector('video')!.dispatchEvent(new Event('seeking'))})
  await act(async()=>{finish([phone])})
  await act(async()=>{jest.advanceTimersByTime(16)})
  expect(view.container.querySelector('.preview-detection')).toBeNull()
  expect(mockReset).toHaveBeenCalled()
})
it('shows a retry and releases the model on failure',async()=>{
  mockDetect.mockRejectedValueOnce(new Error('Inference failed'))
  const view=render(<VideoMockup />)
  await screen.findByText('No phone detected')
  await frame()
  expect(screen.getByText('Detection unavailable')).toBeInTheDocument()
  expect(screen.getByRole('button',{name:'Retry'})).toBeInTheDocument()
  expect(view.container.querySelector('.preview-detection')).toBeNull()
  expect(mockDispose).toHaveBeenCalled()
})

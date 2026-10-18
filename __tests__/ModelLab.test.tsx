import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModelLab from '@/components/ModelLab'

let mockNow = 0
let mockFrames = 0
let mockHideAfter = Infinity
const mockDispose = jest.fn()
jest.mock('@/lib/live-phone-detector', () => ({
  createLivePhoneDetector: async () => ({detect: async () => [], dispose: mockDispose, reset: jest.fn()}),
}))
jest.mock('@/lib/phone-model', () => ({loadPhoneModel: jest.fn()}))
jest.mock('@/lib/validate-gpu-clip', () => ({validateGpuClip: jest.fn()}))
jest.mock('@/lib/next-video-frame', () => ({
  nextVideoFrame: async () => {
    mockNow += 100
    mockFrames++
    if (mockFrames >= mockHideAfter) Object.defineProperty(document, 'hidden', {configurable:true, value:true})
    return mockNow / 1000
  },
}))

beforeEach(() => {
  mockNow = 0; mockFrames = 0; mockHideAfter = Infinity
  Object.defineProperty(document, 'hidden', {configurable:true, value:false})
  jest.spyOn(performance, 'now').mockImplementation(() => mockNow)
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  const context = HTMLCanvasElement.prototype.getContext('2d')
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({...context, drawImage:jest.fn()} as never)
  jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
})
afterEach(() => {
  jest.restoreAllMocks()
  Object.defineProperty(document, 'hidden', {configurable:true, value:false})
})

it('preserves the interruption status when hidden after 20 frames but before 15 seconds', async () => {
  mockHideAfter = 21
  render(<ModelLab />)
  await userEvent.click(screen.getByRole('button', {name:'Run live check'}))
  expect(await screen.findByRole('status')).toHaveTextContent('Test stopped because the tab was hidden.')
  expect(mockNow).toBeLessThan(15000)
  expect(mockDispose).toHaveBeenCalled()
})

it('reports completion when both the frame count and duration are satisfied', async () => {
  render(<ModelLab />)
  await userEvent.click(screen.getByRole('button', {name:'Run live check'}))
  expect(await screen.findByRole('status')).toHaveTextContent('Run complete')
  expect(mockNow).toBeGreaterThanOrEqual(15000)
  expect(mockFrames).toBeGreaterThan(20)
})

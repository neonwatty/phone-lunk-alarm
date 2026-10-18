import { createLivePhoneDetector } from '@/lib/live-phone-detector'
import { initialDetectorModel, VERIFIED_PHONE_MODEL } from '@/lib/detector-models'

const mockDetect = jest.fn()
const mockDispose = jest.fn()
const mockLoad = jest.fn(async (..._args: unknown[]) => ({ detect: mockDetect, dispose: mockDispose }))
jest.mock('@/lib/phone-model', () => ({ loadPhoneModel: (...args: unknown[]) => mockLoad(...args) }))

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(navigator, 'gpu', { configurable: true, value: {} })
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({drawImage: jest.fn()} as never)
})
afterEach(() => { delete (navigator as unknown as {gpu?: unknown}).gpu; jest.restoreAllMocks() })
const phone = (score: number) => ({class:'cell phone',score,bbox:[100,100,20,40]})

it('keeps an explicit choice and defaults according to capability', () => {
  expect(initialDetectorModel('coco-ssd', true)).toBe('coco-ssd')
  expect(initialDetectorModel('r18-gpu', false)).toBe('r18-gpu')
  expect(initialDetectorModel('obsolete', false)).toBe('coco-ssd')
  expect(initialDetectorModel(null, true)).toBe('r18-gpu')
})
it('does not substitute a model when the saved GPU choice is unsupported', async () => {
  delete (navigator as unknown as {gpu?: unknown}).gpu
  await expect(createLivePhoneDetector('r18-gpu', new AbortController().signal)).rejects.toThrow('Select Standard detection')
  expect(mockLoad).not.toHaveBeenCalled()
})
it('continues a real weak nearby detection but never invents a box for a missed frame', async () => {
  mockDetect.mockResolvedValueOnce([phone(.7)]).mockResolvedValueOnce([phone(.22)]).mockResolvedValueOnce([])
  const signal = new AbortController().signal
  const detector = await createLivePhoneDetector('r18-gpu', signal)
  const frame = document.createElement('canvas')
  expect(mockLoad).toHaveBeenCalledWith(signal, VERIFIED_PHONE_MODEL)
  expect(await detector.detect(frame)).toHaveLength(1)
  expect((await detector.detect(frame))[0].score).toBe(.22)
  expect(await detector.detect(frame)).toEqual([])
  detector.dispose()
  expect(mockDispose).toHaveBeenCalledTimes(1)
})
it('discards inference that finishes after a camera reset', async () => {
  let finish!: (value: unknown[]) => void
  mockDetect.mockImplementationOnce(() => new Promise(resolve => {finish = resolve}))
  const detector = await createLivePhoneDetector('r18-gpu', new AbortController().signal)
  const pending = detector.detect(document.createElement('canvas'))
  detector.reset()
  finish([phone(.9)])
  expect(await pending).toEqual([])
  mockDetect.mockResolvedValueOnce([phone(.22)])
  expect(await detector.detect(document.createElement('canvas'))).toEqual([])
  detector.dispose()
})

it('reacquires a weak nearby phone through one miss, but not a long absence', async () => {
  let now = 0
  jest.spyOn(performance, 'now').mockImplementation(() => now)
  mockDetect.mockResolvedValueOnce([phone(.7)]).mockResolvedValueOnce([]).mockResolvedValueOnce([phone(.22)]).mockResolvedValueOnce([]).mockResolvedValueOnce([phone(.22)])
  const detector = await createLivePhoneDetector('r18-gpu', new AbortController().signal)
  const frame = document.createElement('canvas')
  expect(await detector.detect(frame)).toHaveLength(1)
  now = 100
  expect(await detector.detect(frame)).toEqual([])
  now = 200
  expect(await detector.detect(frame)).toHaveLength(1)
  now = 600
  expect(await detector.detect(frame)).toEqual([])
  now = 700
  expect(await detector.detect(frame)).toEqual([])
  detector.dispose()
})

import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhoneDetector from '@/components/PhoneDetector'
import { trackFunnelEvent } from '@/lib/funnel-events'

jest.mock('@/lib/funnel-events', () => ({
  trackFunnelEvent: jest.fn(),
}))

let mockCameraReady = true
let mockVideo: HTMLVideoElement | null = null

// Mock react-webcam
jest.mock('react-webcam', () => ({
  __esModule: true,
  default: jest.fn(({ onUserMediaError, videoConstraints, ref, onUserMedia }) => {
    require('react').useImperativeHandle(ref, () => ({video: mockVideo}))
    require('react').useEffect(() => {if (mockCameraReady) onUserMedia?.({})}, [])
    // Store the error callback for testing
    global.mockWebcamErrorCallback = onUserMediaError
    global.mockWebcamConstraints = videoConstraints
    return (
      <div data-testid="webcam-mock">
        Mock Webcam (facingMode: {videoConstraints?.facingMode})
      </div>
    )
  }),
}))

// Mock TensorFlow.js and COCO-SSD
const mockDetect = jest.fn().mockResolvedValue([])
const mockLoadModel = jest.fn().mockResolvedValue({
  detect: mockDetect,
  dispose: jest.fn(),
})

jest.mock('@tensorflow/tfjs', () => ({
  __esModule: true,
}))

jest.mock('@tensorflow-models/coco-ssd', () => ({
  __esModule: true,
  load: mockLoadModel,
}))

// Mock AlarmEffect component
jest.mock('@/components/AlarmEffect', () => ({
  __esModule: true,
  default: ({ active }: { active: boolean }) => (
    <div data-testid="alarm-effect">{active ? 'ALARM ACTIVE' : 'ALARM INACTIVE'}</div>
  ),
}))

jest.mock('@/components/RecordingPreviewModal', () => ({
  __esModule: true,
  default: ({onClose}: {onClose: () => void}) => <button onClick={onClose}>Close recording preview</button>,
}))

describe('PhoneDetector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockVideo = null
    mockCameraReady = true
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Initial Rendering', () => {
    it('renders without crashing', () => {
      render(<PhoneDetector />)
      expect(screen.getByRole('heading', { name: 'Lunk Alarm' })).toBeInTheDocument()
    })

    it('renders a custom heading when provided', async () => {
      render(<PhoneDetector heading="Try the Phone Lunk Demo" />)

      expect(screen.getByText('Try the Phone Lunk Demo')).toBeInTheDocument()
    })

    it('shows loading state while model loads', () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Loading AI model/i)).toBeInTheDocument()
    })

    it('displays privacy notice', () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Camera stays on your device/i)).toBeInTheDocument()
    })
  })

  describe('Browser Compatibility', () => {
    it('shows compatibility warning when getUserMedia is not supported', async () => {
      // Remove getUserMedia support
      const originalMediaDevices = navigator.mediaDevices
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: undefined,
      })

      render(<PhoneDetector />)

      await waitFor(() => {
        expect(
          screen.getByText(/Camera access is unavailable/i)
        ).toBeInTheDocument()
      })

      // Restore
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: originalMediaDevices,
      })
    })
  })

  describe('Model Loading', () => {
    it('loads COCO-SSD model successfully', async () => {
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(mockLoadModel).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(screen.queryByText(/Loading AI model/i)).not.toBeInTheDocument()
      })
    })

    it('handles model loading failure gracefully', async () => {
      mockLoadModel.mockRejectedValueOnce(new Error('Model load failed'))

      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to load AI model/i)).toBeInTheDocument()
      })
    })

    it('shows retry button after model load failure', async () => {
      mockLoadModel.mockRejectedValueOnce(new Error('Model load failed'))

      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      })
    })
  })

  describe('Model choice', () => {
    it('recovers from an unsupported saved GPU choice and remembers Standard', async () => {
      localStorage.setItem('phoneLunkDetectorModel', 'r18-gpu')
      const user = userEvent.setup({delay: null})
      render(<PhoneDetector />)
      await screen.findByText(/WebGPU is unavailable/)
      await user.selectOptions(screen.getByLabelText('Detection model'), 'coco-ssd')
      await screen.findByRole('button', {name: /Start Camera/i})
      expect(localStorage.getItem('phoneLunkDetectorModel')).toBe('coco-ssd')
      expect(screen.queryByText(/Failed to load AI model/)).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', {name: /Start Camera/i}))
      expect(screen.getByLabelText('Detection model')).toBeEnabled()
      await user.click(screen.getByRole('button', {name: /Stop Camera/i}))
      expect(screen.getByLabelText('Detection model')).toBeEnabled()
    })
    it('recovers from switching to an unavailable model while monitoring', async () => {
      const user = userEvent.setup({delay: null})
      render(<PhoneDetector />)
      await user.click(await screen.findByRole('button', {name: /Start Camera/i}))
      await user.selectOptions(screen.getByLabelText('Detection model'), 'r18-gpu')
      await screen.findByText(/WebGPU is unavailable/)
      expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
      await user.selectOptions(screen.getByLabelText('Detection model'), 'coco-ssd')
      await screen.findByTestId('webcam-mock')
      expect(screen.getByRole('button', {name: /Stop Camera/i})).toBeInTheDocument()
    })
    it('retries a failed model load without starting the camera', async () => {
      mockLoadModel.mockRejectedValueOnce(new Error('Download failed'))
      const user = userEvent.setup({delay: null})
      render(<PhoneDetector />)
      await user.click(await screen.findByRole('button', {name: /Try Again/i}))
      await screen.findByRole('button', {name: /Start Camera/i})
      expect(mockLoadModel).toHaveBeenCalledTimes(2)
      expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
    })
  })

  it('expands without remounting the camera and restores scrolling on exit', async () => {
    const user = userEvent.setup({delay: null})
    render(<PhoneDetector />)
    await user.click(await screen.findByRole('button', {name: /Start Camera/i}))
    const camera = screen.getByTestId('webcam-mock')
    await user.click(screen.getByRole('button', {name: 'Expand camera'}))
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByTestId('webcam-mock')).toBe(camera)
    await user.click(screen.getByRole('button', {name: 'Exit expanded view'}))
    expect(document.body.style.overflow).toBe('')
    expect(screen.getByTestId('webcam-mock')).toBe(camera)
    expect(screen.getByRole('button', {name: 'Expand camera'})).toHaveFocus()
  })

  it('closes expanded view when stopping the camera', async () => {
    const user = userEvent.setup({delay: null})
    render(<PhoneDetector />)
    await user.click(await screen.findByRole('button', {name: /Start Camera/i}))
    await user.click(screen.getByRole('button', {name: 'Expand camera'}))
    await user.click(screen.getByRole('button', {name: 'Stop camera'}))
    expect(document.body.style.overflow).toBe('')
    expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
  })

  describe('Camera Controls', () => {
    it('shows start camera button when model is loaded', async () => {
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })
    })

    it('activates camera when start button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText(/Stop Camera/i)).toBeInTheDocument()
      })

      // Webcam should render
      expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      expect(trackFunnelEvent).toHaveBeenCalledWith('demo_camera_start', {
        location: 'homepage_demo',
        facing_mode: 'environment',
      })
    })

    it('deactivates camera when stop button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      // Start camera
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Stop Camera/i })).toBeInTheDocument()
      })

      // Stop camera
      const stopButton = screen.getByRole('button', { name: /Stop Camera/i })
      await user.click(stopButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      // Webcam should not render
      expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
    })

    it('clears error when starting camera', async () => {
      mockLoadModel.mockRejectedValueOnce(new Error('Model load failed'))
      const user = userEvent.setup({ delay: null })

      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to load AI model/i)).toBeInTheDocument()
      })

      // Reset mock for retry
      mockLoadModel.mockResolvedValueOnce({ detect: mockDetect, dispose: jest.fn() })

      const retryButton = screen.getByRole('button', { name: /Try Again/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.queryByText(/Failed to load AI model/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Camera Switching', () => {
    it('defaults to back camera (environment)', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Check that facingMode is 'environment'
      expect(global.mockWebcamConstraints?.facingMode).toBe('environment')
    })

    it('switches between front and back cameras', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      // Start camera
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTitle(/Switch to front camera/i)).toBeInTheDocument()
      })

      // Switch camera - find by title attribute
      const switchButton = screen.getByTitle(/Switch to front camera/i)
      await user.click(switchButton)

      // Fast-forward the setTimeout
      await act(async () => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByTitle(/Switch to rear camera/i)).toBeInTheDocument()
      })
    })

    it('camera switch button is present when camera is active', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      // Start camera
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Camera switch button should be present (find by title attribute)
      expect(screen.getByTitle(/Switch to front camera/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles camera permission denied error', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Simulate permission denied error
      act(() => {
        global.mockWebcamErrorCallback!({ name: 'NotAllowedError' })
      })

      await waitFor(() => {
        expect(screen.getByText(/Camera access denied/i)).toBeInTheDocument()
      })
    })

    it('handles no camera found error', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Simulate no camera error
      act(() => {
        global.mockWebcamErrorCallback!({ name: 'NotFoundError' })
      })

      await waitFor(() => {
        expect(screen.getByText(/No camera detected/i)).toBeInTheDocument()
      })
    })

    it('handles camera in use error', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Simulate camera in use error
      act(() => {
        global.mockWebcamErrorCallback!({ name: 'NotReadableError' })
      })

      await waitFor(() => {
        expect(screen.getByText(/Camera is being used by another application/i)).toBeInTheDocument()
      })
    })

    it('handles overconstrained error', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Simulate overconstrained error
      act(() => {
        global.mockWebcamErrorCallback!({ name: 'OverconstrainedError' })
      })

      await waitFor(() => {
        expect(screen.getByText(/Selected camera mode not available/i)).toBeInTheDocument()
      })
    })

    it('shows retry button after camera error', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Trigger error
      act(() => {
        global.mockWebcamErrorCallback!({ name: 'NotAllowedError' })
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      })
    })
  })

  it('clears recording state after inference failure and permits a new recording after retry', async () => {
    const originalRecorder = global.MediaRecorder
    const capture = HTMLCanvasElement.prototype.captureStream
    const context = HTMLCanvasElement.prototype.getContext
    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {})
    let recorder!: TestRecorder
    class TestRecorder {
      state = 'inactive'
      onstop: (() => void) | null = null
      static isTypeSupported() { return true }
      constructor() { recorder = this }
      start() { this.state = 'recording' }
      stop() { this.state = 'inactive'; this.onstop?.() }
    }
    global.MediaRecorder = TestRecorder as unknown as typeof MediaRecorder
    HTMLCanvasElement.prototype.captureStream = jest.fn().mockReturnValue({})
    const drawing = HTMLCanvasElement.prototype.getContext('2d')
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({...drawing, drawImage: jest.fn()})
    mockVideo = document.createElement('video')
    mockDetect.mockRejectedValueOnce(new Error('Inference failed'))
    const user = userEvent.setup({delay:null})
    const view = render(<PhoneDetector />)
    try {
      await user.click(await screen.findByRole('button', {name:'Start Camera'}))
      await user.click(screen.getByRole('button', {name:'Start recording'}))
      expect(recorder.state).toBe('recording')
      await act(async () => { jest.advanceTimersByTime(100) })
      expect(recorder.state).toBe('inactive')
      await user.click(screen.getByRole('button', {name:'Close recording preview'}))
      await user.click(screen.getByRole('button', {name:'Try Again'}))
      expect(screen.queryByRole('button', {name:'Stop recording'})).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', {name:'Start recording'}))
      expect(recorder.state).toBe('recording')
      await user.click(screen.getByRole('button', {name:'Stop recording'}))
    } finally {
      view.unmount()
      global.MediaRecorder = originalRecorder
      HTMLCanvasElement.prototype.captureStream = capture
      HTMLCanvasElement.prototype.getContext = context
      errorLog.mockRestore()
    }
  })

  describe('Detection Logic', () => {
    it('does not clear the canvas by resizing while the next inference is pending', async () => {
      const play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
      const pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
      mockVideo = document.createElement('video')
      Object.defineProperties(mockVideo, {
        videoWidth: {value:640}, videoHeight: {value:480}, readyState: {value:4},
      })
      const widthSetter = jest.spyOn(HTMLCanvasElement.prototype, 'width', 'set')
      let finish!: (predictions: unknown[]) => void
      mockDetect.mockResolvedValueOnce([{class:'cell phone',score:.9,bbox:[100,100,40,80]}])
        .mockImplementationOnce(() => new Promise(resolve => { finish=resolve }))
      const user = userEvent.setup({delay:null})
      const view = render(<PhoneDetector />)
      await user.click(await screen.findByRole('button', {name:/Start Camera/i}))
      await act(async () => { jest.advanceTimersByTime(100) })
      await act(async () => { jest.advanceTimersByTime(16) })
      const resizes = widthSetter.mock.calls.length
      expect(resizes).toBeGreaterThan(0)
      await act(async () => { jest.advanceTimersByTime(100) })
      expect(mockDetect).toHaveBeenCalledTimes(2)
      expect(widthSetter).toHaveBeenCalledTimes(resizes)
      await user.click(screen.getByRole('button', {name:/Stop Camera/i}))
      await act(async () => { finish([]) })
      view.unmount()
      widthSetter.mockRestore()
      play.mockRestore(); pause.mockRestore()
    })

    it('displays detection counter', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText(/Detections: 0/i)).toBeInTheDocument()
      })
    })

    it('shows monitoring indicator when camera is active', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText(/MONITORING/i)).toBeInTheDocument()
      })
    })

    it('shows "All Clear" status initially', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText(/All Clear/i)).toBeInTheDocument()
      })
    })

    it('renders AlarmEffect component', async () => {
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByTestId('alarm-effect')).toBeInTheDocument()
      })
    })
  })

  describe('Retry Functionality', () => {
    it('retries camera access when retry button clicked', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /Start Camera/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Trigger error
      act(() => {
        global.mockWebcamErrorCallback!({ name: 'NotAllowedError' })
      })

      await waitFor(() => {
        expect(screen.getByText(/Camera access denied/i)).toBeInTheDocument()
      })

      // Retry
      const retryButton = screen.getByRole('button', { name: /Try Again/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.queryByText(/Camera access denied/i)).not.toBeInTheDocument()
      })

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })
    })
  })

  describe('Camera readiness and settings', () => {
    it('offers sound settings before camera access', async () => {
      const user = userEvent.setup({delay:null})
      render(<PhoneDetector />)
      await user.click(screen.getByText(/^Settings/))
      expect(screen.getByLabelText('Alarm sound')).toBeVisible()
      expect(screen.getByLabelText('Volume')).toBeVisible()
      expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
    })
    it('allows cancellation while permission is pending and disables recording', async () => {
      mockCameraReady = false
      const user = userEvent.setup({delay:null})
      render(<PhoneDetector />)
      await user.click(await screen.findByRole('button',{name:/Start Camera/i}))
      expect(screen.getByText('Waiting for camera access')).toBeInTheDocument()
      expect(screen.queryByText('MONITORING')).not.toBeInTheDocument()
      expect(screen.getByRole('button',{name:'Start recording'})).toBeDisabled()
      await user.click(screen.getByRole('button',{name:/Stop Camera/i}))
      expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
    })
  })
})

import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhoneDetector from '@/components/PhoneDetector'

// Mock react-webcam
jest.mock('react-webcam', () => ({
  __esModule: true,
  default: jest.fn(({ onUserMediaError, videoConstraints }) => {
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

describe('PhoneDetector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Initial Rendering', () => {
    it('renders without crashing', () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Try It Yourself/i)).toBeInTheDocument()
    })

    it('shows loading state while model loads', () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Loading AI model/i)).toBeInTheDocument()
    })

    it('displays privacy notice', () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Your camera feed stays private/i)).toBeInTheDocument()
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
          screen.getByText(/If you were using a better browser you would see the demo here/i)
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
      mockLoadModel.mockResolvedValueOnce({ detect: mockDetect })

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
        expect(screen.getByText(/BACK/i)).toBeInTheDocument()
      })

      // Switch camera - find by text content since title attribute isn't accessible name
      const switchButton = screen.getByText(/🔄/)
      await user.click(switchButton)

      // Fast-forward the setTimeout
      await act(async () => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText(/FRONT/i)).toBeInTheDocument()
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

      // Camera switch button should be present (find by icon)
      expect(screen.getByText(/🔄/)).toBeInTheDocument()
      expect(screen.getByText(/BACK/i)).toBeInTheDocument()
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

  describe('Detection Logic', () => {
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

  describe('UI Info Cards', () => {
    it('displays info cards about the detector', () => {
      render(<PhoneDetector />)

      expect(screen.getByText(/Real-Time Detection/i)).toBeInTheDocument()
      expect(screen.getByText(/Privacy First/i)).toBeInTheDocument()
      expect(screen.getByText(/COCO-SSD Model/i)).toBeInTheDocument()
    })
  })
})

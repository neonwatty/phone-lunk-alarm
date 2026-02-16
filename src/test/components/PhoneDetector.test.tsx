import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Declare global mocks for webcam callback access
declare global {
  var mockWebcamErrorCallback: ((err: any) => void) | undefined
  var mockWebcamConstraints: { facingMode?: string } | undefined
}

// Mock react-webcam
vi.mock('react-webcam', () => ({
  default: vi.fn(({ onUserMediaError, videoConstraints }: any) => {
    globalThis.mockWebcamErrorCallback = onUserMediaError
    globalThis.mockWebcamConstraints = videoConstraints
    return (
      <div data-testid="webcam-mock">
        Mock Webcam (facingMode: {videoConstraints?.facingMode})
      </div>
    )
  }),
}))

// Mock TensorFlow.js and COCO-SSD
const mockDetect = vi.fn().mockResolvedValue([])
const mockLoadModel = vi.fn().mockResolvedValue({
  detect: mockDetect,
})

vi.mock('@tensorflow/tfjs', () => ({}))

vi.mock('@tensorflow-models/coco-ssd', () => ({
  load: mockLoadModel,
}))

// Mock AlarmEffect component
vi.mock('@/components/AlarmEffect', () => ({
  default: ({ active }: { active: boolean }) => (
    <div data-testid="alarm-effect">{active ? 'ALARM ACTIVE' : 'ALARM INACTIVE'}</div>
  ),
}))

// Mock SoundSelector
vi.mock('@/components/SoundSelector', () => ({
  default: () => <div data-testid="sound-selector">Sound Selector</div>,
}))

// Mock ThemeSelector
vi.mock('@/components/ThemeSelector', () => ({
  default: () => <div data-testid="theme-selector">Theme Selector</div>,
}))

// Mock RecordingPreviewModal
vi.mock('@/components/RecordingPreviewModal', () => ({
  default: () => <div data-testid="recording-preview">Recording Preview</div>,
}))

// Mock useAlarmSound hook
vi.mock('@/hooks/useAlarmSound', () => ({
  useAlarmSound: () => ({
    selectedSound: 'airhorn',
    volume: 0.7,
    playSound: vi.fn(),
    stopSound: vi.fn(),
    previewSound: vi.fn(),
    changeSound: vi.fn(),
    changeVolume: vi.fn(),
    isLoaded: true,
  }),
}))

// Import after mocks
import PhoneDetector from '@/components/PhoneDetector'

// Helper to set up browser environment for PhoneDetector
function setupBrowserMocks() {
  // Mock WebGL support at the prototype level (avoids intercepting all createElement calls)
  const origGetContext = HTMLCanvasElement.prototype.getContext
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    type: string,
    ...args: unknown[]
  ) {
    if (type === 'webgl' || type === 'experimental-webgl') {
      return {} as WebGLRenderingContext // truthy => WebGL supported
    }
    return origGetContext.call(this, type as '2d', ...(args as []))
  } as typeof HTMLCanvasElement.prototype.getContext)

  // Ensure navigator.mediaDevices.getUserMedia exists
  if (!navigator.mediaDevices) {
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      value: { getUserMedia: vi.fn() },
    })
  } else if (!navigator.mediaDevices.getUserMedia) {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      writable: true,
      configurable: true,
      value: vi.fn(),
    })
  }
}

describe('PhoneDetector', { timeout: 15000 }, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupBrowserMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial Rendering', () => {
    it('renders without crashing', async () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Be The Alarm/i)).toBeInTheDocument()
    })

    it('displays privacy notice', () => {
      render(<PhoneDetector />)
      expect(screen.getByText(/Your camera feed stays private/i)).toBeInTheDocument()
    })
  })

  describe('Browser Compatibility', () => {
    it('shows compatibility warning when getUserMedia is not supported', async () => {
      const originalMediaDevices = navigator.mediaDevices
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        configurable: true,
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
        configurable: true,
        value: originalMediaDevices,
      })
    })
  })

  describe('Model Loading', () => {
    it('calls the COCO-SSD load function', async () => {
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(mockLoadModel).toHaveBeenCalled()
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

      expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
    })

    it('deactivates camera when stop button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Stop Camera/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Stop Camera/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      expect(screen.queryByTestId('webcam-mock')).not.toBeInTheDocument()
    })
  })

  describe('Camera Switching', () => {
    it('defaults to back camera (environment)', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      expect(globalThis.mockWebcamConstraints?.facingMode).toBe('environment')
    })

    it('camera switch button is present when camera is active', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

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

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      act(() => {
        globalThis.mockWebcamErrorCallback!({ name: 'NotAllowedError' })
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

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      act(() => {
        globalThis.mockWebcamErrorCallback!({ name: 'NotFoundError' })
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

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      act(() => {
        globalThis.mockWebcamErrorCallback!({ name: 'NotReadableError' })
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

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      act(() => {
        globalThis.mockWebcamErrorCallback!({ name: 'OverconstrainedError' })
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

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      act(() => {
        globalThis.mockWebcamErrorCallback!({ name: 'NotAllowedError' })
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      })
    })
  })

  describe('Detection Logic', () => {
    it('shows monitoring indicator when camera is active', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

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

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

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

  describe('UI Info Cards', () => {
    it('displays info cards about the detector', async () => {
      render(<PhoneDetector />)

      expect(screen.getAllByText(/Instant Justice/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/On-The-Go/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/No Escape/i).length).toBeGreaterThan(0)
    })
  })

  describe('Retry Functionality', () => {
    it('retries camera access when retry button clicked', async () => {
      const user = userEvent.setup({ delay: null })
      render(<PhoneDetector />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Start Camera/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Start Camera/i }))

      await waitFor(() => {
        expect(screen.getByTestId('webcam-mock')).toBeInTheDocument()
      })

      // Trigger error
      act(() => {
        globalThis.mockWebcamErrorCallback!({ name: 'NotAllowedError' })
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
})

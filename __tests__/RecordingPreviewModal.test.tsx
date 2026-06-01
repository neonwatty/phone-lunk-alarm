import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecordingPreviewModal from '@/components/RecordingPreviewModal'
import { trackFunnelEvent } from '@/lib/funnel-events'

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}))

jest.mock('@/lib/funnel-events', () => ({
  trackFunnelEvent: jest.fn(),
}))

describe('RecordingPreviewModal', () => {
  const originalOpen = window.open
  const originalAnchorClick = HTMLAnchorElement.prototype.click

  beforeEach(() => {
    jest.clearAllMocks()
    window.open = jest.fn()
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(() => 'blob:phone-lunk-test'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    })
    HTMLAnchorElement.prototype.click = jest.fn()
  })

  afterEach(() => {
    window.open = originalOpen
    HTMLAnchorElement.prototype.click = originalAnchorClick
  })

  it('tracks video downloads from the preview', async () => {
    const user = userEvent.setup()
    const videoBlob = new Blob(['clip'], { type: 'video/webm' })

    render(<RecordingPreviewModal videoBlob={videoBlob} onClose={jest.fn()} />)
    await user.click(screen.getByRole('button', { name: /download/i }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('demo_download', {
      location: 'recording_preview',
      blob_size: videoBlob.size,
    })
  })

  it('tracks social share clicks from the preview', async () => {
    const user = userEvent.setup()

    render(<RecordingPreviewModal videoBlob={new Blob(['clip'], { type: 'video/webm' })} onClose={jest.fn()} />)
    await user.click(screen.getByRole('button', { name: 'X' }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('demo_share_x', {
      location: 'recording_preview',
    })
    expect(window.open).toHaveBeenCalled()
  })
})

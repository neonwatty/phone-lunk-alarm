import { render, screen } from '@testing-library/react'
import VideoMockup from '@/components/VideoMockup'
import { createLivePhoneDetector } from '@/lib/live-phone-detector'

jest.mock('@/lib/live-phone-detector', () => ({ createLivePhoneDetector: jest.fn() }))

it('shows the original recorded example without starting live inference', () => {
  render(<VideoMockup />)
  expect(screen.getByRole('img')).toHaveAttribute('src', '/images/examples/phone-lunk-1.gif')
  expect(screen.getByText('PHONE LUNK DETECTED')).toBeInTheDocument()
  expect(createLivePhoneDetector).not.toHaveBeenCalled()
  expect(screen.queryByText(/loading detector|247|live detection/i)).not.toBeInTheDocument()
})

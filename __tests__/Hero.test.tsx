import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hero from '@/components/Hero'
import siteConfig from '@/site.config.mjs'
import { trackFunnelEvent } from '@/lib/funnel-events'

jest.mock('@/components/VideoMockup', () => () => <div>Analyzed on this device · Recorded footage · Sound off</div>)

jest.mock('@/lib/funnel-events', () => ({
  trackFunnelEvent: jest.fn(),
}))

describe('Hero', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders headline', () => {
    render(<Hero />)

    expect(screen.getByText(siteConfig.hero.headline)).toBeInTheDocument()
  })

  it('renders subheadline', () => {
    render(<Hero />)

    // The subheadline is split by '\n' and rendered across multiple spans with <br/> tags
    const lines = siteConfig.hero.subheadline.split('\n')
    lines.forEach(line => {
      expect(screen.getByText(line.trim())).toBeInTheDocument()
    })
  })

  it('offers one launch action without pilot links', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Launch Phone Lunk' })).toHaveAttribute('href', '/demo')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('tracks hero CTA clicks', async () => {
    const user = userEvent.setup()
    render(<Hero />)

    await user.click(screen.getByRole('link', { name: 'Launch Phone Lunk' }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('cta_click', {
      location: 'hero_primary',
      href: '/demo',
      label: 'Launch Phone Lunk',
    })
  })

  it('labels the example footage without claiming a live camera or real usage counts', () => {
    render(<Hero />)
    expect(screen.getByText('Analyzed on this device · Recorded footage · Sound off')).toBeInTheDocument()
    expect(screen.queryByText(/247|shaming|vigilante|pilot/i)).not.toBeInTheDocument()
  })
})

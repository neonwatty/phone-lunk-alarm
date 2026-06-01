import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CTA from '@/components/CTA'
import siteConfig from '@/site.config.mjs'
import { trackFunnelEvent } from '@/lib/funnel-events'

jest.mock('@/lib/funnel-events', () => ({
  trackFunnelEvent: jest.fn(),
}))

describe('CTA', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('tracks the configured CTA click', async () => {
    const user = userEvent.setup()
    render(<CTA location="homepage_post_demo" />)

    await user.click(screen.getByRole('link', { name: siteConfig.cta.buttonText }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('cta_click', {
      location: 'homepage_post_demo',
      href: siteConfig.cta.buttonHref,
      label: siteConfig.cta.buttonText,
    })
  })
})

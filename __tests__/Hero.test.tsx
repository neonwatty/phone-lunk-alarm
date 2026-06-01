import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hero from '@/components/Hero'
import siteConfig from '@/site.config.mjs'
import { trackFunnelEvent } from '@/lib/funnel-events'

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

  it('renders configured demo and gym pilot CTAs', () => {
    render(<Hero />)

    const primaryCTA = screen.getByRole('link', { name: 'Try the Demo' })
    expect(primaryCTA).toBeInTheDocument()
    expect(primaryCTA).toHaveAttribute('href', '/demo')

    if (siteConfig.hero.secondaryCTA) {
      const secondaryCTA = screen.getByRole('link', { name: 'Gym Pilot Concept' })
      expect(secondaryCTA).toBeInTheDocument()
      expect(secondaryCTA).toHaveAttribute('href', '/waitlist')
    }
  })

  it('tracks hero CTA clicks', async () => {
    const user = userEvent.setup()
    render(<Hero />)

    await user.click(screen.getByRole('link', { name: 'Try the Demo' }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('cta_click', {
      location: 'hero_primary',
      href: '/demo',
      label: 'Try the Demo',
    })
  })

  it('renders refreshed phone lunk definition', () => {
    render(<Hero />)

    expect(
      screen.getByText(/Someone camping on gym equipment while scrolling/)
    ).toBeInTheDocument()
  })

  it('does not render unimplemented policy guide CTA', () => {
    render(<Hero />)

    const unimplementedPolicyGuideCTA = ['Read the Phone', 'Policy Guide'].join(' ')
    expect(screen.queryByText(unimplementedPolicyGuideCTA)).not.toBeInTheDocument()
  })

  it('renders pilot email CTA', () => {
    render(<Hero />)

    const pilotCTA = screen.getByRole('link', { name: 'Email About a Pilot' })
    expect(pilotCTA).toHaveAttribute('href', siteConfig.social.email)
  })
})

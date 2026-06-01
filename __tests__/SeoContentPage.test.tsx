import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SeoContentPage from '@/components/SeoContentPage'
import { trackFunnelEvent } from '@/lib/funnel-events'

jest.mock('@/lib/funnel-events', () => ({
  trackFunnelEvent: jest.fn(),
}))

describe('SeoContentPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders title, intro, sections, and CTA links', () => {
    render(
      <SeoContentPage
        title="Sample SEO Page"
        intro="Helpful intro copy."
        trackingLocation="sample_page"
        sections={[
          {
            heading: 'First section',
            paragraphs: ['First paragraph.'],
            bullets: ['Useful bullet'],
          },
          {
            heading: 'Second section',
            paragraphs: ['Second paragraph.'],
          },
        ]}
        relatedLinks={[
          {
            href: '/phone-use-at-gym',
            label: 'Phone etiquette',
            description: 'A related guide.',
          },
        ]}
        cta={{
          title: 'Try the demo',
          body: 'See it in action.',
          href: '/demo',
          label: 'Open demo',
        }}
      />
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Sample SEO Page' })).toBeInTheDocument()
    expect(screen.getByText('Helpful intro copy.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'First section' })).toBeInTheDocument()
    expect(screen.getByText('First paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Useful bullet')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Second section' })).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Try the demo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Related guides' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Phone etiquette/ })).toHaveAttribute('href', '/phone-use-at-gym')
    expect(screen.getByText('See it in action.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open demo' })).toHaveAttribute('href', '/demo')
  })

  it('tracks guide CTA clicks', async () => {
    const user = userEvent.setup()
    render(
      <SeoContentPage
        title="Sample SEO Page"
        intro="Helpful intro copy."
        trackingLocation="sample_page"
        sections={[
          {
            heading: 'First section',
            paragraphs: ['First paragraph.'],
          },
        ]}
        cta={{
          title: 'Try the demo',
          body: 'See it in action.',
          href: '/demo',
          label: 'Open demo',
        }}
      />
    )

    await user.click(screen.getByRole('link', { name: 'Open demo' }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('guide_cta_click', {
      location: 'sample_page',
      href: '/demo',
      label: 'Open demo',
    })
  })
})

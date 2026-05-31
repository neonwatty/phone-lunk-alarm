import { render, screen } from '@testing-library/react'
import SeoContentPage from '@/components/SeoContentPage'

describe('SeoContentPage', () => {
  it('renders title, intro, sections, and CTA links', () => {
    render(
      <SeoContentPage
        title="Sample SEO Page"
        intro="Helpful intro copy."
        sections={[
          {
            heading: 'First section',
            paragraphs: ['First paragraph.'],
            bullets: ['Useful bullet'],
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
    expect(screen.getByText('Useful bullet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open demo' })).toHaveAttribute('href', '/demo')
  })
})

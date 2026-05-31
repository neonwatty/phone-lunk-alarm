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
          {
            heading: 'Second section',
            paragraphs: ['Second paragraph.'],
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
    expect(screen.getByText('See it in action.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open demo' })).toHaveAttribute('href', '/demo')
  })
})

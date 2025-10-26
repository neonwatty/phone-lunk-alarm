import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import siteConfig from '@/site.config.mjs'

describe('Footer', () => {
  it('renders copyright with author name', () => {
    render(<Footer />)

    // Check for the author name link with correct href
    const authorLink = screen.getByText(siteConfig.author.name)
    expect(authorLink).toBeInTheDocument()
    expect(authorLink).toHaveAttribute('href', siteConfig.social.twitter)
    expect(authorLink).toHaveAttribute('target', '_blank')
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders social links when configured', () => {
    render(<Footer />)

    // Check if GitHub link exists (if configured)
    if (siteConfig.social.github) {
      const githubLink = screen.getByLabelText('GitHub')
      expect(githubLink).toHaveAttribute('href', siteConfig.social.github)
    }
  })
})

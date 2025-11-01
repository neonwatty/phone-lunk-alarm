import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import siteConfig from '@/site.config.mjs'

describe('Footer', () => {
  it('renders copyright with author name', () => {
    const { container } = render(<Footer />)

    // Check for the author name anywhere in the footer
    expect(container.textContent).toContain(siteConfig.author.name)

    // Check for current year in copyright
    const currentYear = new Date().getFullYear()
    expect(container.textContent).toContain(`© ${currentYear}`)
  })

  it('renders social links when configured', () => {
    render(<Footer />)

    // Check if GitHub link exists (if configured)
    if (siteConfig.social.github) {
      const githubLink = screen.getByLabelText('GitHub')
      expect(githubLink).toHaveAttribute('href', siteConfig.social.github)
    }
  })

  it('renders author name as a link to Twitter', () => {
    render(<Footer />)

    // Find the author name link
    const authorLink = screen.getByRole('link', { name: siteConfig.author.name })

    // Verify it points to the Twitter URL
    expect(authorLink).toHaveAttribute('href', siteConfig.social.twitter)

    // Verify it has proper security and accessibility attributes
    expect(authorLink).toHaveAttribute('target', '_blank')
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

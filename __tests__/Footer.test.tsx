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
})

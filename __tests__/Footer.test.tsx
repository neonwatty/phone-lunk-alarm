import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import siteConfig from '@/site.config.mjs'

describe('Footer', () => {
  it('renders copyright with author name', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${currentYear}.*${siteConfig.author.name}`))).toBeInTheDocument()
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

import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import siteConfig from '@/site.config.mjs'

describe('Hero', () => {
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

  it('renders primary CTA button', () => {
    render(<Hero />)

    const primaryCTA = screen.getByText(siteConfig.hero.primaryCTA.text)
    expect(primaryCTA).toBeInTheDocument()
    expect(primaryCTA.closest('a')).toHaveAttribute('href', siteConfig.hero.primaryCTA.href)
  })

  it('renders secondary CTA button when configured', () => {
    render(<Hero />)

    if (siteConfig.hero.secondaryCTA) {
      const secondaryCTA = screen.getByText(siteConfig.hero.secondaryCTA.text)
      expect(secondaryCTA).toBeInTheDocument()
    }
  })

  it('renders refreshed phone lunk definition', () => {
    render(<Hero />)

    expect(
      screen.getByText(/Someone camping on gym equipment while scrolling/)
    ).toBeInTheDocument()
  })

  it('renders detection demo CTA', () => {
    render(<Hero />)

    const demoCTA = screen.getByText('See Detection Demo')
    expect(demoCTA).toBeInTheDocument()
    expect(demoCTA.closest('a')).toHaveAttribute('href', '/demo')
  })
})

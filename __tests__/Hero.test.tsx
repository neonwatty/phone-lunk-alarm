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

    expect(screen.getByText(siteConfig.hero.subheadline)).toBeInTheDocument()
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
})

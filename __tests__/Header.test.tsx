import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'
import { ThemeProvider } from '@/components/ThemeProvider'
import siteConfig from '@/site.config.mjs'

describe('Header', () => {
  it('renders site name', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    expect(screen.getByText(siteConfig.site.name)).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    siteConfig.navigation.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    })
  })

  it('renders theme toggle button', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })
})

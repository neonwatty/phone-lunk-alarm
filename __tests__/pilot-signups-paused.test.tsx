import { render, screen } from '@testing-library/react'
import WaitlistPage from '@/app/waitlist/page'
import CTA from '@/components/CTA'

describe('paused gym pilot signups', () => {
  it('keeps the pilot page and demo available without rendering any signup form or email links', () => {
    const { container } = render(<WaitlistPage />)

    expect(screen.getByRole('heading', { name: 'Pilot signups are paused' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Try the browser demo' })).toHaveAttribute('href', '/demo')
    expect(container.querySelector('form, a[href^="mailto:"], [action*="formsubmit.co"]')).toBeNull()
  })

  it('routes the shared pilot call to action to pilot details, not email', () => {
    render(<CTA />)

    expect(screen.getByRole('link', { name: 'View Pilot Details' })).toHaveAttribute('href', '/waitlist')
    expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument()
  })
})

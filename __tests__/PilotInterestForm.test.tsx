import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PilotInterestForm from '@/components/PilotInterestForm'
import { trackFunnelEvent } from '@/lib/funnel-events'

jest.mock('@/lib/funnel-events', () => ({
  trackFunnelEvent: jest.fn(),
}))

describe('PilotInterestForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('tracks and submits through the static lead form endpoint', async () => {
    const user = userEvent.setup()
    render(<PilotInterestForm />)

    await user.type(screen.getByLabelText('Your name'), 'Alex Owner')
    await user.type(screen.getByLabelText('Email'), 'alex@example.com')
    await user.type(screen.getByLabelText('Gym name'), 'Rack City Gym')
    await user.selectOptions(screen.getByLabelText('Gym type'), 'independent-gym')
    await user.type(screen.getByLabelText('Location'), 'Phoenix, AZ')
    await user.type(
      screen.getByLabelText('What phone-use problem are you trying to solve?'),
      'Members scroll on benches during peak hours.'
    )

    const submitButton = screen.getByRole('button', { name: 'Send Pilot Inquiry' })
    const form = submitButton.closest('form')
    form?.addEventListener('submit', (event) => event.preventDefault())

    await user.click(submitButton)

    expect(trackFunnelEvent).toHaveBeenCalledWith('pilot_form_start', {
      location: 'waitlist_form',
    })
    expect(trackFunnelEvent).toHaveBeenCalledWith('pilot_form_submit', {
      location: 'waitlist_form',
      gym_type: 'independent-gym',
      has_email: true,
      has_location: true,
      problem_length: 'Members scroll on benches during peak hours.'.length,
      delivery_path: 'formsubmit',
    })
    expect(trackFunnelEvent).toHaveBeenCalledWith('pilot_form_provider_submit', {
      location: 'waitlist_form',
      gym_type: 'independent-gym',
      provider: 'formsubmit',
    })
    expect(form).toHaveAttribute('action', 'https://formsubmit.co/hello@phone-lunk.app')
    expect(form).toHaveAttribute('method', 'POST')
    expect(localStorage.getItem('phoneLunkPilotLeadSubmission')).toContain('"gymType":"independent-gym"')
    expect(localStorage.getItem('phoneLunkPilotLeadSubmission')).not.toContain('alex@example.com')
    expect(localStorage.getItem('phoneLunkPilotLeadSubmission')).not.toContain('Rack City Gym')
    expect(screen.getByRole('status')).toHaveTextContent('Sending your pilot inquiry')
  })

  it('does not let localStorage failures block provider submission tracking', async () => {
    const user = userEvent.setup()
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })
    render(<PilotInterestForm />)

    await user.type(screen.getByLabelText('Email'), 'alex@example.com')
    await user.type(screen.getByLabelText('Gym name'), 'Rack City Gym')
    await user.selectOptions(screen.getByLabelText('Gym type'), 'independent-gym')
    await user.type(
      screen.getByLabelText('What phone-use problem are you trying to solve?'),
      'Members scroll on benches during peak hours.'
    )

    const submitButton = screen.getByRole('button', { name: 'Send Pilot Inquiry' })
    submitButton.closest('form')?.addEventListener('submit', (event) => event.preventDefault())

    await user.click(submitButton)

    expect(trackFunnelEvent).toHaveBeenCalledWith('pilot_form_provider_submit', {
      location: 'waitlist_form',
      gym_type: 'independent-gym',
      provider: 'formsubmit',
    })

    setItemSpy.mockRestore()
  })

  it('tracks demo clicks from the pilot form', async () => {
    const user = userEvent.setup()
    render(<PilotInterestForm />)

    await user.click(screen.getByRole('link', { name: 'Try the Demo First' }))

    expect(trackFunnelEvent).toHaveBeenCalledWith('pilot_form_demo_click', {
      location: 'waitlist_form',
      href: '/demo',
    })
  })
})

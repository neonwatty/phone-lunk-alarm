import { trackFunnelEvent } from '@/lib/funnel-events'

describe('trackFunnelEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.va = jest.fn()
    window.dataLayer = []
    window.gtag = jest.fn()
  })

  it('sends cleaned events to Vercel Analytics, dataLayer, and gtag globals', () => {
    trackFunnelEvent('cta_click', {
      location: 'hero',
      href: '/demo',
      label: 'Try the Demo',
      empty: undefined,
      missing: null,
    })

    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'cta_click',
      data: {
        page_path: '/',
        location: 'hero',
        href: '/demo',
        label: 'Try the Demo',
      },
    })
    expect(window.dataLayer).toEqual([
      {
        event: 'cta_click',
        page_path: '/',
        location: 'hero',
        href: '/demo',
        label: 'Try the Demo',
      },
    ])
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
      page_path: '/',
      location: 'hero',
      href: '/demo',
      label: 'Try the Demo',
    })
  })

  it('does not let analytics transport failures break the caller', () => {
    window.va = jest.fn(() => {
      throw new Error('analytics unavailable')
    })
    window.dataLayer = undefined
    window.gtag = jest.fn(() => {
      throw new Error('gtag unavailable')
    })

    expect(() => trackFunnelEvent('demo_camera_start')).not.toThrow()
  })
})

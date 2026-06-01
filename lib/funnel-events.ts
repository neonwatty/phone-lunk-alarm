'use client'

export type FunnelEventName =
  | 'cta_click'
  | 'guide_cta_click'
  | 'pilot_email_click'
  | 'pilot_form_start'
  | 'pilot_form_submit'
  | 'pilot_form_provider_submit'
  | 'pilot_form_demo_click'
  | 'waitlist_demo_click'
  | 'demo_camera_start'
  | 'demo_camera_stop'
  | 'demo_camera_retry'
  | 'demo_camera_switch'
  | 'demo_camera_error'
  | 'demo_phone_detected'
  | 'demo_recording_start'
  | 'demo_recording_stop'
  | 'demo_recording_complete'
  | 'demo_recording_blocked'
  | 'demo_recording_preview_close'
  | 'demo_share_tiktok'
  | 'demo_share_x'
  | 'demo_share_linkedin'
  | 'demo_share_native'
  | 'demo_share_native_fallback'
  | 'demo_download'
  | 'demo_copy_caption'
  | 'demo_copy_link'

export type FunnelEventProperties = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
    va?: (...args: unknown[]) => void
  }
}

function cleanProperties(properties: FunnelEventProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null)
  ) as Record<string, string | number | boolean>
}

export function trackFunnelEvent(event: FunnelEventName, properties: FunnelEventProperties = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const payload = cleanProperties({
    page_path: window.location.pathname,
    ...properties,
  })

  try {
    window.va?.('event', {
      name: event,
      data: payload,
    })
  } catch {
    // Analytics should never block the demo or CTA flow.
  }

  try {
    window.dataLayer?.push({ event, ...payload })
  } catch {
    // Ignore analytics transport failures.
  }

  try {
    window.gtag?.('event', event, payload)
  } catch {
    // Ignore analytics transport failures.
  }
}

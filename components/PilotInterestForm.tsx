'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { trackFunnelEvent } from '@/lib/funnel-events'

type PilotLeadForm = {
  name: string
  email: string
  gymName: string
  gymType: string
  location: string
  problem: string
}

const initialForm: PilotLeadForm = {
  name: '',
  email: '',
  gymName: '',
  gymType: '',
  location: '',
  problem: '',
}

const FORM_ENDPOINT = 'https://formsubmit.co/hello@phone-lunk.app'
const THANK_YOU_URL = 'https://www.phone-lunk.app/waitlist/?pilot=sent'

export default function PilotInterestForm() {
  const [form, setForm] = useState<PilotLeadForm>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const hasStartedRef = useRef(false)
  const subject = useMemo(
    () => `Phone Lunk gym pilot${form.gymName ? ` - ${form.gymName}` : ''}`,
    [form.gymName]
  )

  const updateField = (field: keyof PilotLeadForm, value: string) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackFunnelEvent('pilot_form_start', {
        location: 'waitlist_form',
      })
    }

    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    if (!event.currentTarget.checkValidity()) {
      return
    }

    try {
      localStorage.setItem(
        'phoneLunkPilotLeadSubmission',
        JSON.stringify({
          submittedAt: new Date().toISOString(),
          gymType: form.gymType || 'unspecified',
          hasEmail: Boolean(form.email),
          hasLocation: Boolean(form.location),
          problemLength: form.problem.length,
        })
      )
    } catch {
      // Local storage is convenience-only; provider submit should still proceed.
    }

    trackFunnelEvent('pilot_form_submit', {
      location: 'waitlist_form',
      gym_type: form.gymType || 'unspecified',
      has_email: Boolean(form.email),
      has_location: Boolean(form.location),
      problem_length: form.problem.length,
      delivery_path: 'formsubmit',
    })

    trackFunnelEvent('pilot_form_provider_submit', {
      location: 'waitlist_form',
      gym_type: form.gymType || 'unspecified',
      provider: 'formsubmit',
    })
    setSubmitted(true)
  }

  return (
    <section className="max-w-3xl mx-auto card">
      <h2 className="heading-md mb-4">Tell me about your gym</h2>
      <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Share the basics and Phone Lunk will send a pilot inquiry to the project inbox through a
        static-site form endpoint. The browser demo still keeps camera processing local.
      </p>

      <form className="space-y-5 text-left" action={FORM_ENDPOINT} method="POST" onSubmit={submitLead}>
        <input type="hidden" name="_subject" value={subject} />
        <input type="hidden" name="_replyto" value={form.email} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value={THANK_YOU_URL} />
        <input className="hidden" type="text" name="_honey" tabIndex={-1} autoComplete="off" />

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Your name</span>
            <input
              name="name"
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
              style={{ borderColor: 'var(--color-border-primary)' }}
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Email</span>
            <input
              name="email"
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
              style={{ borderColor: 'var(--color-border-primary)' }}
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              autoComplete="email"
              type="email"
              required
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Gym name</span>
            <input
              name="gym_name"
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
              style={{ borderColor: 'var(--color-border-primary)' }}
              value={form.gymName}
              onChange={(event) => updateField('gymName', event.target.value)}
              autoComplete="organization"
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-2">Gym type</span>
            <select
              name="gym_type"
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
              style={{ borderColor: 'var(--color-border-primary)' }}
              value={form.gymType}
              onChange={(event) => updateField('gymType', event.target.value)}
              required
            >
              <option value="">Select one</option>
              <option value="independent-gym">Independent gym</option>
              <option value="boutique-studio">Boutique studio</option>
              <option value="training-facility">Training facility</option>
              <option value="campus-or-corporate">Campus or corporate gym</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-semibold mb-2">Location</span>
          <input
            name="location"
            className="w-full rounded-lg border px-4 py-3 bg-transparent"
            style={{ borderColor: 'var(--color-border-primary)' }}
            value={form.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="City, state, or region"
            autoComplete="address-level2"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-2">What phone-use problem are you trying to solve?</span>
          <textarea
            name="phone_use_problem"
            className="w-full rounded-lg border px-4 py-3 bg-transparent min-h-32"
            style={{ borderColor: 'var(--color-border-primary)' }}
            value={form.problem}
            onChange={(event) => updateField('problem', event.target.value)}
            placeholder="Members camping on racks, filming in busy areas, equipment flow during peak hours..."
            required
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <button className="btn btn-primary" type="submit">
            Send Pilot Inquiry
          </button>
          <Link
            className="btn btn-secondary"
            href="/demo"
            onClick={() =>
              trackFunnelEvent('pilot_form_demo_click', {
                location: 'waitlist_form',
                href: '/demo',
              })
            }
          >
            Try the Demo First
          </Link>
        </div>

        {submitted && (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }} role="status">
            Sending your pilot inquiry through the form endpoint.
          </p>
        )}
      </form>
    </section>
  )
}

import { render } from '@testing-library/react'
import JsonLd from '@/components/JsonLd'

describe('JsonLd', () => {
  it('escapes less-than characters when serializing script contents', () => {
    const dangerousValue = '</script><script>alert(1)</script>'

    const { container } = render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Thing',
          name: dangerousValue,
        }}
      />
    )

    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script).toBeInTheDocument()
    expect(script?.innerHTML).toContain('\\u003c/script>\\u003cscript>alert(1)\\u003c/script>')
    expect(script?.innerHTML).not.toContain(dangerousValue)
  })
})

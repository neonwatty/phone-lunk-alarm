export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: 'Phone Lunk',
    description: 'Phone Lunk detects idiots doom scrolling at the gym and puts them on blast.',
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: 'Jeremy Watt'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Phone Lunk',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
    />
  )
}

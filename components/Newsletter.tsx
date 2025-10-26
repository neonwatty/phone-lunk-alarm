interface NewsletterProps {
  customHeading?: string
  customDescription?: string
}

export default function Newsletter({ customHeading, customDescription }: NewsletterProps) {
  return (
    <div className="w-full transition-all duration-300">
      <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>

      <div className="max-w-2xl mx-auto text-center mb-6">
        <h3 className="text-2xl font-bold mb-3 transition-all duration-300"
            style={{
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em'
            }}>
          {customHeading || 'Subscribe for updates'}
        </h3>
        {customDescription && (
          <p className="text-base transition-all duration-300"
             style={{ color: 'var(--color-text-secondary)' }}>
            {customDescription}
          </p>
        )}
        {!customHeading && (
          <p className="text-base transition-all duration-300"
             style={{ color: 'var(--color-text-secondary)' }}>
            More amazing ideas like this, open source releases, updates, and learnings
          </p>
        )}
      </div>

      <iframe
        src="https://subscribe-forms.beehiiv.com/a32a2710-173d-423e-b754-3a4cd3c25cc9"
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
        style={{
          display: 'block',
          margin: '0 auto',
          width: '560px',
          height: '200px',
          borderRadius: '0px',
          backgroundColor: 'transparent',
          maxWidth: '100%'
        }}
      />
    </div>
  )
}

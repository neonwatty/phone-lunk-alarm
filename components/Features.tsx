import siteConfig from '@/site.config.mjs'
import * as HeroIcons from '@heroicons/react/24/outline'

export default function Features() {
  const { features } = siteConfig

  // Helper function to get icon component from name
  const getIcon = (iconName: string) => {
    // Convert icon name from kebab-case to PascalCase
    // e.g., 'bolt' -> 'BoltIcon', 'cog-6-tooth' -> 'Cog6ToothIcon'
    const pascalCase = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Icon'

    const IconComponent = (HeroIcons as any)[pascalCase]
    return IconComponent || HeroIcons.SparklesIcon // Fallback icon
  }

  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="heading-lg mb-4"
            style={{ color: 'var(--color-text-primary)' }}>
          Features
        </h2>
        <p className="text-lg px-6 py-3 rounded-lg inline-block" style={{
          backgroundColor: 'var(--color-accent-light)',
          color: 'var(--color-accent-primary)',
          lineHeight: '1.6'
        }}>
          Everything you need to build amazing products
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = getIcon(feature.icon)

          return (
            <div
              key={index}
              className="card stagger-animation"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                     style={{
                       background: 'var(--gradient-professional)',
                       boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                     }}>
                  <IconComponent className="w-6 h-6"
                                 style={{ color: 'var(--color-text-inverse)' }} />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}>
                {feature.title}
              </h3>

              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

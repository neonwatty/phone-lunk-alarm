import React from 'react'
import siteConfig from '@/site.config.mjs'

export default function HowItWorks() {
  const { howItWorks } = siteConfig

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {howItWorks.sectionTitle}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {howItWorks.sectionSubtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {howItWorks.steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                {step.number}
              </div>

              {/* Card */}
              <div className="w-full p-8 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                {/* Emoji */}
                <div className="text-6xl mb-4">{step.emoji}</div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

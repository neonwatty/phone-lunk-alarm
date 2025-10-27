import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'About Jeremy',
  description: 'AI Engineer, HVAC certified technician, and Religious Studies BA passionate about building intelligent systems.',
}

export default function About() {
  return (
    <>
      <StructuredData type="website" />

      <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: 'transparent' }}>
        <Header />

        <main className="mb-10">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="mb-4 text-center">
                <img
                  src={`${basePath}/images/jeremy-watt-headshot.jpg`}
                  alt="Jeremy Watt"
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-indigo-200 dark:border-indigo-700 shadow-xl mb-6"
                />
                <h1 className="text-4xl font-bold mb-4">Hi, I'm Jeremy!</h1>
              </div>

              <div className="space-y-6">
                <section>
                  <p className="text-lg text-center" style={{ color: 'var(--color-text-primary)' }}>
                    I'm an AI Engineer busy building and thinking about the exponential timeline we live in.
                  </p>
                </section>

                <section>
                  <p className="text-lg text-center" style={{ color: 'var(--color-text-primary)' }}>
                    In previous lives I've been a scholar of Religion, a PhD student in Machine Learning, and an HVAC certified technician.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--color-text-primary)' }}>
                    Recent Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <a href="https://chromewebstore.google.com/detail/ytgify/dnljofakogbecppbkmnoffppkfdmpfje" target="_blank" rel="noopener noreferrer" className="glass-card rounded-xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
                      <div className="aspect-[16/9] overflow-hidden" style={{ backgroundColor: 'var(--color-background-tertiary)' }}>
                        <img
                          src={`${basePath}/images/projects/ytgify.svg`}
                          alt="YTGify"
                          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                          YTGify
                        </h3>
                        <p className="line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                          Create GIFs from YouTube videos instantly with this Chrome Extension
                        </p>
                      </div>
                    </a>

                    <a href="https://mybodyscans.xyz/" target="_blank" rel="noopener noreferrer" className="glass-card rounded-xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
                      <div className="aspect-[16/9] overflow-hidden" style={{ backgroundColor: 'var(--color-background-tertiary)' }}>
                        <img
                          src={`${basePath}/images/projects/mybodyscans.jpg`}
                          alt="MyBodyScans"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                          MyBodyScans
                        </h3>
                        <p className="line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                          Organize Your InBody Scans With AI
                        </p>
                      </div>
                    </a>

                    <a href="https://www.npmjs.com/package/tfq" target="_blank" rel="noopener noreferrer" className="glass-card rounded-xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
                      <div className="aspect-[16/9] overflow-hidden" style={{ backgroundColor: 'var(--color-background-tertiary)' }}>
                        <img
                          src={`${basePath}/images/projects/npm-icon.svg`}
                          alt="TFQ"
                          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                          TFQ (Test Failure Queue)
                        </h3>
                        <p className="line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                          Test Failure Queue - Claude Code powered test debugging without context overload
                        </p>
                      </div>
                    </a>
                  </div>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--color-text-primary)' }}>
                    Book
                  </h2>
                  <div className="max-w-3xl mx-auto glass-card rounded-xl overflow-hidden p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 mx-auto md:mx-0">
                        <img
                          src={`${basePath}/images/ml-refined-cover.png`}
                          alt="Machine Learning Refined Book Cover"
                          className="w-48 h-auto rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                          Machine Learning Refined: Foundations, Algorithms, and Applications
                        </h3>
                        <p className="mb-2 text-base" style={{ color: 'var(--color-text-secondary)' }}>
                          By Jeremy Watt, Reza Borhani, Aggelos K. Katsaggelos
                        </p>
                        <p className="mb-4 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                          Published by Cambridge University Press
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href="https://www.amazon.com/Machine-Learning-Refined-Foundations-Applications/dp/1108480721"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}
                          >
                            View on Amazon
                          </a>
                          <a
                            href="https://github.com/neonwatty/machine-learning-refined"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity border"
                            style={{ backgroundColor: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)' }}
                          >
                            GitHub Repo
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

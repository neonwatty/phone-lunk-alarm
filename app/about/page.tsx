import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'

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
                  src="/images/jeremy-watt-headshot.jpg"
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
                  <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-text-primary)' }}>
                    Projects
                  </h2>
                  <div className="grid gap-4 max-w-2xl mx-auto">
                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' }}>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        <a href="https://chromewebstore.google.com/detail/ytgify/dnljofakogbecppbkmnoffppkfdmpfje" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                          YTGify
                        </a>
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        Chrome Extension that enables users to instantly create GIFs from YouTube videos.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' }}>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        <a href="https://mybodyscans.xyz/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                          MyBodyScans
                        </a>
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        AI-powered application designed to help organize InBody scan data.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' }}>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        <a href="https://www.npmjs.com/package/tfq" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                          TFQ (Test Failure Queue)
                        </a>
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        Debugging tool powered by Claude Code that addresses test failures without context overload.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-text-primary)' }}>
                    Book
                  </h2>
                  <div className="max-w-2xl mx-auto p-4 rounded-lg border" style={{ borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' }}>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Machine Learning Refined: Foundations, Algorithms, and Applications
                    </h3>
                    <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      By Jeremy Watt, Reza Borhani, Aggelos K. Katsaggelos
                    </p>
                    <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      Published by Cambridge University Press
                    </p>
                    <div className="flex gap-3">
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
                        className="inline-flex items-center px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-primary)' }}
                      >
                        GitHub Repo
                      </a>
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

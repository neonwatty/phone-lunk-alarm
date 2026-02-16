import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

import { ThemeProvider } from '@/components/ThemeProvider'
import siteConfig from '@/lib/site-config'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.site.keywords,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  metadataBase: new URL(siteConfig.site.url),
  openGraph: {
    type: siteConfig.seo.openGraph.type as 'website',
    locale: siteConfig.seo.openGraph.locale,
    url: siteConfig.site.url,
    siteName: siteConfig.site.name,
    title: siteConfig.site.name,
    description: siteConfig.seo.description,
    images: siteConfig.seo.openGraph.images,
  },
  twitter: {
    card: siteConfig.seo.twitter.cardType as 'summary_large_image',
    title: siteConfig.site.name,
    description: siteConfig.seo.description,
    creator: siteConfig.seo.twitter.handle,
    site: siteConfig.seo.twitter.site,
    images: siteConfig.seo.openGraph.images.map(img => img.url),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_TRACKING_ID = siteConfig.analytics.googleAnalyticsId

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MKS2GNDH');`,
          }}
        />
        {/* Theme initialization to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} min-h-screen font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MKS2GNDH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Providers>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--color-background-elevated)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-primary)',
                },
              }}
            />
          </ThemeProvider>
        </Providers>
        {siteConfig.analytics.vercelAnalytics && <Analytics />}
        {siteConfig.analytics.vercelSpeedInsights && <SpeedInsights />}
      </body>
    </html>
  )
}

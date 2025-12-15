'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface ShareButtonsProps {
  url?: string
}

export default function ShareButtons({
  url = 'https://phone-lunk.app'
}: ShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false)

  // Pre-populated share messages for the reveal page
  const messages = {
    twitter: "I just tried to sign up for an AI that publicly shames phone users at gyms. It's not real. I am the phone lunk. 🚨",
    linkedin: "Just fell for the most elaborate fake SaaS product I've ever seen. Well played.",
  }

  // Twitter/X Share
  const shareToTwitter = () => {
    const twitterUrl = new URL('https://twitter.com/intent/tweet')
    twitterUrl.searchParams.set('text', messages.twitter)
    twitterUrl.searchParams.set('url', url)

    window.open(
      twitterUrl.toString(),
      '_blank',
      'noopener,noreferrer,width=550,height=420'
    )
  }

  // LinkedIn Share
  const shareToLinkedIn = () => {
    const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/')
    linkedInUrl.searchParams.set('url', url)

    window.open(
      linkedInUrl.toString(),
      '_blank',
      'noopener,noreferrer,width=550,height=730'
    )
  }

  // Copy to Clipboard
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!', {
          icon: '📋',
          duration: 2500,
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        textArea.remove()

        if (successful) {
          toast.success('Link copied to clipboard!', { icon: '📋' })
        } else {
          throw new Error('Copy failed')
        }
      }
    } catch (err) {
      console.error('Copy failed:', err)
      toast.error('Failed to copy link', { icon: '❌' })
    }
  }

  // Native Web Share API (primarily for mobile)
  const shareNative = async () => {
    if (!navigator.share) {
      await copyToClipboard()
      return
    }

    setIsSharing(true)
    try {
      await navigator.share({
        title: 'Phone Lunk',
        text: messages.twitter,
        url: url,
      })
    } catch (err) {
      // AbortError means user cancelled, don't show error
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {/* Twitter/X Button */}
      <button
        onClick={shareToTwitter}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg bg-black text-white"
        aria-label="Share on Twitter/X"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>

      {/* LinkedIn Button */}
      <button
        onClick={shareToLinkedIn}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg text-white"
        style={{ background: '#0A66C2' }}
        aria-label="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        Share on LinkedIn
      </button>

      {/* Copy Link Button */}
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        style={{
          borderColor: 'var(--color-accent-primary)',
          color: 'var(--color-accent-primary)',
          background: 'transparent',
        }}
        aria-label="Copy link to clipboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy Link
      </button>

      {/* Native Share Button (mobile only) */}
      <button
        onClick={shareNative}
        disabled={isSharing}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg text-white sm:hidden"
        style={{ background: 'var(--color-accent-primary)' }}
        aria-label="Share via native share menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>
    </div>
  )
}

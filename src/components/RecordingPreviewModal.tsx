'use client'

import { useRef, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getShareCaption, getTikTokShareUrl, copyToClipboard } from '@/lib/video-utils'

interface RecordingPreviewModalProps {
  videoBlob: Blob
  onClose: () => void
}

export default function RecordingPreviewModal({ videoBlob, onClose }: RecordingPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')

  useEffect(() => {
    const url = URL.createObjectURL(videoBlob)
    setVideoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [videoBlob])

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `phone-lunk-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Video downloaded!', { icon: '📥' })
  }

  const shareToTwitter = () => {
    const text = "I just got put on blast by Phone Lunk 🚨 AI-powered gym justice is real"
    const url = 'https://phone-lunk.app'
    const twitterUrl = new URL('https://twitter.com/intent/tweet')
    twitterUrl.searchParams.set('text', text)
    twitterUrl.searchParams.set('url', url)
    window.open(twitterUrl.toString(), '_blank', 'noopener,noreferrer,width=550,height=420')
  }

  const shareToLinkedIn = () => {
    const url = 'https://phone-lunk.app'
    const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/')
    linkedInUrl.searchParams.set('url', url)
    window.open(linkedInUrl.toString(), '_blank', 'noopener,noreferrer,width=550,height=730')
  }

  const shareToTikTok = async () => {
    // Copy hashtags to clipboard first
    const caption = getShareCaption()
    const copied = await copyToClipboard(caption)
    if (copied) {
      toast.success('Hashtags copied! Paste in TikTok caption', { icon: '📋', duration: 3000 })
    }
    // Open TikTok upload
    window.open(getTikTokShareUrl(), '_blank', 'noopener,noreferrer')
  }

  const copyCaption = async () => {
    const caption = `I just got put on blast by @phonelunk 🚨 ${getShareCaption()}`
    const copied = await copyToClipboard(caption)
    if (copied) {
      toast.success('Caption & hashtags copied!', { icon: '📋' })
    } else {
      toast.error('Failed to copy')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://phone-lunk.app')
      toast.success('Link copied!', { icon: '📋' })
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const file = new File([videoBlob], 'phone-lunk.webm', { type: 'video/webm' })
        await navigator.share({
          title: 'Phone Lunk Detection',
          text: 'I just got put on blast 🚨',
          url: 'https://phone-lunk.app',
          files: [file],
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // Fallback to just sharing URL if file sharing not supported
          try {
            await navigator.share({
              title: 'Phone Lunk Detection',
              text: 'I just got put on blast 🚨',
              url: 'https://phone-lunk.app',
            })
          } catch {
            toast.error('Share failed')
          }
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: 'var(--gradient-elevated)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            🎬 Your Clip
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ✕
          </button>
        </div>

        {/* Video Preview */}
        <div className="p-4">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full rounded-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>

        {/* Share Buttons */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
          <p className="text-sm mb-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Share your moment of justice
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Download */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--color-accent-primary)',
                color: '#ffffff',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>

            {/* TikTok */}
            <button
              onClick={shareToTikTok}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-white"
              style={{ background: '#000000' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              TikTok
            </button>

            {/* Twitter/X */}
            <button
              onClick={shareToTwitter}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-black text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareToLinkedIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-white"
              style={{ background: '#0A66C2' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>

            {/* Copy Caption */}
            <button
              onClick={copyCaption}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border-2 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'var(--color-border-secondary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Copy Caption
            </button>

            {/* Copy Link */}
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border-2 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'var(--color-border-secondary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>

            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 sm:hidden"
                style={{
                  background: 'var(--color-accent-primary)',
                  color: '#ffffff',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

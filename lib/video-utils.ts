export type ExportFormat = 'standard' | 'tiktok'

export const EXPORT_FORMATS: Record<ExportFormat, {
  name: string
  aspectRatio: number
  description: string
  width: number
  height: number
}> = {
  standard: {
    name: 'Standard (16:9)',
    aspectRatio: 16 / 9,
    description: 'Best for YouTube, Twitter, general sharing',
    width: 1280,
    height: 720,
  },
  tiktok: {
    name: 'TikTok (9:16)',
    aspectRatio: 9 / 16,
    description: 'Optimized for TikTok, Instagram Reels, YouTube Shorts',
    width: 1080,
    height: 1920,
  },
}

const FORMAT_STORAGE_KEY = 'phoneLunkExportFormat'

export function loadExportFormatPreference(): ExportFormat {
  if (typeof window === 'undefined') return 'standard'
  const saved = localStorage.getItem(FORMAT_STORAGE_KEY) as ExportFormat | null
  return saved && EXPORT_FORMATS[saved] ? saved : 'standard'
}

export function saveExportFormatPreference(format: ExportFormat): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(FORMAT_STORAGE_KEY, format)
}

// Calculate dimensions for TikTok crop (center crop from 16:9 to 9:16)
export function getTikTokCropDimensions(videoWidth: number, videoHeight: number) {
  const targetRatio = 9 / 16
  const sourceRatio = videoWidth / videoHeight

  let cropWidth: number
  let cropHeight: number
  let cropX: number
  let cropY: number

  if (sourceRatio > targetRatio) {
    // Source is wider - crop sides
    cropHeight = videoHeight
    cropWidth = videoHeight * targetRatio
    cropX = (videoWidth - cropWidth) / 2
    cropY = 0
  } else {
    // Source is taller - crop top/bottom
    cropWidth = videoWidth
    cropHeight = videoWidth / targetRatio
    cropX = 0
    cropY = (videoHeight - cropHeight) / 2
  }

  return {
    cropX: Math.floor(cropX),
    cropY: Math.floor(cropY),
    cropWidth: Math.floor(cropWidth),
    cropHeight: Math.floor(cropHeight),
  }
}

// Generate TikTok share URL/intent
export function getTikTokShareUrl(): string {
  // TikTok doesn't have a direct share URL with video upload
  // Best we can do is open TikTok
  return 'https://www.tiktok.com/upload'
}

// Generate share text with hashtags
export function getShareCaption(): string {
  return `#PhoneLunkAlarm #GymFail #PhoneLunk #Gym #Fitness #NoPhoneZone #GymEtiquette`
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

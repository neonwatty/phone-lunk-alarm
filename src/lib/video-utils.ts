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

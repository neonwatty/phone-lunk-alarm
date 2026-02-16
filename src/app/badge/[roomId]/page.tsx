import { createClient } from '@/lib/supabase/server'

interface BadgePageProps {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ theme?: string; style?: string }>
}

async function getRoom(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('id, name')
    .eq('id', roomId.toUpperCase())
    .single()
  if (error) return null
  return data as { id: string; name: string }
}

async function getDailyCount(roomId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_counts')
    .select('count')
    .eq('room_id', roomId)
    .eq('date', today)
    .single()
  return data?.count ?? 0
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M9 0L0 3.5V9.5C0 14.75 3.84 19.64 9 20.5C14.16 19.64 18 14.75 18 9.5V3.5L9 0Z"
        fill={color}
      />
      <rect x="7.5" y="5" width="3" height="7" rx="1.5" fill="white" />
      <circle cx="9" cy="15" r="1.2" fill="white" />
    </svg>
  )
}

export default async function BadgePage({ params, searchParams }: BadgePageProps) {
  const { roomId } = await params
  const { theme: themeParam, style: styleParam } = await searchParams

  const theme = themeParam === 'light' ? 'light' : 'dark'
  const style = styleParam === 'vertical' ? 'vertical' : 'horizontal'

  const room = await getRoom(roomId)
  const dailyCount = room ? await getDailyCount(roomId) : 0

  const isDark = theme === 'dark'
  const isVertical = style === 'vertical'

  const bgColor = isDark ? '#1a1a2e' : '#f0f0f5'
  const textColor = isDark ? '#e0e0e8' : '#2a2a3e'
  const subtextColor = isDark ? '#8888a0' : '#6a6a80'
  const accentColor = isDark ? '#6366f1' : '#4f46e5'
  const borderColor = isDark ? '#2a2a44' : '#d0d0dd'

  const containerStyle: React.CSSProperties = isVertical
    ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '120px',
        height: '140px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '12px 8px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textDecoration: 'none',
        color: textColor,
        boxSizing: 'border-box',
      }
    : {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        width: '240px',
        height: '60px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '8px 14px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textDecoration: 'none',
        color: textColor,
        boxSizing: 'border-box',
      }

  const titleStyle: React.CSSProperties = {
    fontSize: isVertical ? '11px' : '12px',
    fontWeight: 700,
    lineHeight: '1.2',
    color: textColor,
    textAlign: isVertical ? 'center' : 'left',
    margin: 0,
  }

  const countStyle: React.CSSProperties = {
    fontSize: isVertical ? '10px' : '11px',
    fontWeight: 500,
    lineHeight: '1.2',
    color: subtextColor,
    textAlign: isVertical ? 'center' : 'left',
    margin: 0,
  }

  const joinUrl = `/join/${roomId}`

  return (
    <a href={joinUrl} target="_blank" rel="noopener noreferrer" style={containerStyle}>
      <ShieldIcon color={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={titleStyle}>Phone Lunk Protected</p>
        {room && (
          <p style={countStyle}>
            {dailyCount} {dailyCount === 1 ? 'phone' : 'phones'} caught today
          </p>
        )}
      </div>
    </a>
  )
}

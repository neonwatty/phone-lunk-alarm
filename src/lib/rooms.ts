import { createClient } from '@/lib/supabase/client'

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]
  }
  return code
}

export interface Room {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export async function createRoom(name: string, ownerId: string): Promise<Room> {
  const supabase = createClient()
  const id = generateRoomCode()
  const { data, error } = await supabase
    .from('rooms')
    .insert({ id, name, owner_id: ownerId })
    .select()
    .single()
  if (error) throw error
  return data as Room
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('id, name, owner_id, created_at')
    .eq('id', roomId.toUpperCase())
    .single()
  if (error) return null
  return data as Room
}

export async function getDailyCount(roomId: string): Promise<number> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_counts')
    .select('count')
    .eq('room_id', roomId)
    .eq('date', today)
    .single()
  return data?.count ?? 0
}

export async function incrementDailyCount(roomId: string): Promise<void> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase.rpc('increment_daily_count', {
    p_room_id: roomId,
    p_date: today,
  })
  if (error) throw error
}

import { describe, it, expect } from 'vitest'
import { generateRoomCode } from '@/lib/rooms'

const VALID_CHARS = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/

describe('generateRoomCode', () => {
  it('returns a 6-character string', () => {
    const code = generateRoomCode()
    expect(code).toHaveLength(6)
  })

  it('only contains unambiguous characters (no I, O, 0, 1)', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateRoomCode()
      expect(code).toMatch(VALID_CHARS)
    }
  })

  it('generates unique codes across 50 iterations', () => {
    const codes = new Set<string>()
    for (let i = 0; i < 50; i++) {
      codes.add(generateRoomCode())
    }
    expect(codes.size).toBe(50)
  })
})

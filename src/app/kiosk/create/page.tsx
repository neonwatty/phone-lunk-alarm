'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { createRoom } from '@/lib/rooms'

export default function KioskCreatePage() {
  const router = useRouter()
  const [gymName, setGymName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/kiosk/create')
        return
      }

      setUserId(user.id)
      setAuthLoading(false)
    }

    checkAuth()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !gymName.trim()) return

    setError(null)
    setLoading(true)

    try {
      const room = await createRoom(gymName.trim(), userId)
      router.push(`/kiosk/${room.id}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create kiosk. Please try again.',
      )
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create a Kiosk
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Set up a phone detection display for your gym
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="gym-name"
                className="block text-sm font-medium text-foreground"
              >
                Gym Name
              </label>
              <input
                id="gym-name"
                type="text"
                required
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="e.g. Iron Paradise Gym"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !gymName.trim()}
              className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Kiosk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

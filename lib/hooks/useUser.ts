'use client'

import { useEffect, useState } from 'react'
import { User } from '@/lib/db/models/user.types'
import { userService } from '@/lib/db/services/userService'

export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(userId)

        if (isMounted) {
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            setError(response.error || 'Failed to fetch user')
          }
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(String(err))
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [userId])

  return { user, loading, error }
}

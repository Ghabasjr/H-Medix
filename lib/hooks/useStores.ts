'use client'

import { useEffect, useState } from 'react'
import { Store } from '@/lib/db/models/store.types'
import { storeService } from '@/lib/db/services/storeService'

export function useStores(ownerId: string | null) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerId) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchStores = async () => {
      try {
        const response = await storeService.getStoresByOwner(ownerId)

        if (isMounted) {
          if (response.success && response.data) {
            setStores(response.data)
          } else {
            setError(response.error || 'Failed to fetch stores')
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

    fetchStores()

    return () => {
      isMounted = false
    }
  }, [ownerId])

  return { stores, loading, error }
}

export function useAllStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchStores = async () => {
      try {
        const response = await storeService.getActiveStores()

        if (isMounted) {
          if (response.success && response.data) {
            setStores(response.data)
          } else {
            setError(response.error || 'Failed to fetch stores')
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

    fetchStores()

    return () => {
      isMounted = false
    }
  }, [])

  return { stores, loading, error }
}

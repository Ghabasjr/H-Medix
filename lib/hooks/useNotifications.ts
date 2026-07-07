'use client'

import { useEffect, useState } from 'react'
import { Notification } from '@/lib/db/models/notification.types'
import { notificationService } from '@/lib/db/services/notificationService'
import { QueryOptions } from '@/lib/db/types'

export function useNotifications(userId: string | null, options?: QueryOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotificationsByUser(userId, options)

        if (isMounted) {
          if (response.success && response.data) {
            setNotifications(response.data)
          } else {
            setError(response.error || 'Failed to fetch notifications')
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

    fetchNotifications()

    return () => {
      isMounted = false
    }
  }, [userId, options])

  return { notifications, loading, error }
}

export function useUnreadNotifications(userId: string | null) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadNotifications(userId)

        if (isMounted) {
          if (response.success && response.data) {
            setUnreadCount(response.data.length)
          } else {
            setError(response.error || 'Failed to fetch unread count')
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

    fetchUnreadCount()

    return () => {
      isMounted = false
    }
  }, [userId])

  return { unreadCount, loading, error }
}

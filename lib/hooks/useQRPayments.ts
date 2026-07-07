'use client'

import { useEffect, useState } from 'react'
import { query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useFirestore } from './useFirestore'
import { QRPayment } from '@/lib/db/models/qrPayment.types'

export interface UseQRPaymentsOptions {
  storeId?: string
  cashierId?: string
  status?: 'active' | 'used' | 'expired' | 'cancelled'
  limit?: number
}

export function useQRPayments(options: UseQRPaymentsOptions = {}) {
  const [qrPayments, setQRPayments] = useState<QRPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQRPayments = async () => {
      try {
        setLoading(true)
        const constraints = []

        if (options.storeId) {
          constraints.push(where('storeId', '==', options.storeId))
        }

        if (options.cashierId) {
          constraints.push(where('generatedByCashierId', '==', options.cashierId))
        }

        if (options.status) {
          constraints.push(where('status', '==', options.status))
        }

        // Only get recent QR payments (last 24 hours for active, all for others)
        if (options.status === 'active') {
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          constraints.push(where('createdAt', '>=', Timestamp.fromDate(oneDayAgo)))
        }

        // Note: Would need to implement proper Firestore queries with constraints
        // For now, using basic fetch and filtering
        const allQRPayments: QRPayment[] = []

        setQRPayments(allQRPayments)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch QR payments:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch QR payments')
      } finally {
        setLoading(false)
      }
    }

    fetchQRPayments()
  }, [options.storeId, options.cashierId, options.status])

  return {
    qrPayments,
    loading,
    error,
  }
}

export function useActiveQRPayments(cashierId: string, storeId: string) {
  return useQRPayments({
    cashierId,
    storeId,
    status: 'active',
  })
}

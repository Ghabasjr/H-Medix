'use client'

import { useEffect, useState } from 'react'
import { Transaction } from '@/lib/db/models/transaction.types'
import { transactionService } from '@/lib/db/services/transactionService'
import { QueryOptions } from '@/lib/db/types'

export function useTransactions(storeId?: string | null, options?: QueryOptions) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchTransactions = async () => {
      try {
        const response = storeId
          ? await transactionService.getTransactionsByStore(storeId, options)
          : await transactionService.getAllTransactions(options)

        if (isMounted) {
          if (response.success && response.data) {
            setTransactions(response.data)
          } else {
            setError(response.error || 'Failed to fetch transactions')
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

    fetchTransactions()

    return () => {
      isMounted = false
    }
  }, [storeId, options])

  return { transactions, loading, error }
}

export function useTransactionsByCustomer(customerId: string | null, options?: QueryOptions) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchTransactions = async () => {
      try {
        const response = await transactionService.getTransactionsByCustomer(customerId, options)

        if (isMounted) {
          if (response.success && response.data) {
            setTransactions(response.data)
          } else {
            setError(response.error || 'Failed to fetch transactions')
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

    fetchTransactions()

    return () => {
      isMounted = false
    }
  }, [customerId, options])

  return { transactions, loading, error }
}

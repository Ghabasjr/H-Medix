'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { QRPayment } from '@/lib/db/models/qrPayment.types'

interface UseQRPaymentDetailsReturn {
  qrPayment: QRPayment | null
  loading: boolean
  error: string | null
}

export function useQRPaymentDetails(qrId: string): UseQRPaymentDetailsReturn {
  const [qrPayment, setQRPayment] = useState<QRPayment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!qrId) {
      setError('Invalid QR ID')
      setLoading(false)
      return
    }

    const fetchQRPayment = async () => {
      try {
        setLoading(true)
        setError(null)

        const qrRef = doc(db, 'qrPayments', qrId)
        const qrSnap = await getDoc(qrRef)

        if (!qrSnap.exists()) {
          setError('QR payment not found')
          setQRPayment(null)
          return
        }

        const data = qrSnap.data()

        // Check if QR code is expired
        const expiresAt = new Date(data.expiresAt)
        if (expiresAt < new Date()) {
          setError('This QR code has expired')
          setQRPayment(null)
          return
        }

        // Check if already used
        if (data.status === 'used') {
          setError('This payment has already been processed')
          setQRPayment(null)
          return
        }

        setQRPayment({
          ...data,
          id: qrSnap.id,
        } as QRPayment)
      } catch (err) {
        console.error('Error fetching QR payment:', err)
        setError('Failed to load payment details')
        setQRPayment(null)
      } finally {
        setLoading(false)
      }
    }

    fetchQRPayment()
  }, [qrId])

  return { qrPayment, loading, error }
}

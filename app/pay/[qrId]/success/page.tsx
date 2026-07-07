'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PaymentSuccess } from '@/components/payment/PaymentSuccess'
import { PaymentError } from '@/components/payment/PaymentError'
import { Spinner } from '@/components/ui/spinner'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { Transaction } from '@/lib/db/models/transaction.types'
import { downloadReceiptAsText } from '@/lib/utils/receipt/receiptFormatter'
import { useToast } from '@/contexts/ToastContext'

export default function PaymentSuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const qrId = params.qrId as string
  const txId = searchParams.get('txId')

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true)
        if (!txId) {
          setError('Transaction ID not found')
          return
        }

        const txRef = doc(db, 'transactions', txId)
        const txSnap = await getDoc(txRef)

        if (!txSnap.exists()) {
          setError('Transaction not found')
          return
        }

        setTransaction({
          ...txSnap.data(),
          id: txSnap.id,
        } as Transaction)
      } catch (err) {
        console.error('Error fetching transaction:', err)
        setError('Failed to load transaction details')
      } finally {
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [txId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading receipt...</p>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <PaymentError
        title="Receipt Not Found"
        message={error || 'The transaction receipt could not be loaded'}
      />
    )
  }

  const handlePrint = () => {
    try {
      window.print()
      addToast('Receipt printed', 'success')
    } catch (err) {
      console.error('Print error:', err)
      addToast('Failed to print receipt', 'error')
    }
  }

  const handleDownload = () => {
    try {
      downloadReceiptAsText({
        transactionId: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        timestamp: transaction.createdAt,
        customerEmail: transaction.customerEmail,
        paymentMethod: transaction.paymentMethod || 'QR Code',
      })
      addToast('Receipt downloaded', 'success')
    } catch (err) {
      console.error('Download error:', err)
      addToast('Failed to download receipt', 'error')
    }
  }

  return (
    <PaymentSuccess
      transaction={transaction}
      onPrint={handlePrint}
      onDownload={handleDownload}
    />
  )
}

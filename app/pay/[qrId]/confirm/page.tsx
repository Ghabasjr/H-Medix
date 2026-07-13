'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PaymentConfirmation } from '@/components/payment/PaymentConfirmation'
import { PaymentError } from '@/components/payment/PaymentError'
import { Spinner } from '@/components/ui/spinner'
import { useQRPaymentDetails } from '@/lib/hooks/useQRPaymentDetails'
import { processPayment } from '@/lib/services/payment/processPayment'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { customerService } from '@/lib/db/services/customerService'

export default function PaymentConfirmPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const { user } = useAuth()
  const qrId = params.qrId as string

  const { qrPayment, loading, error: fetchError } = useQRPaymentDetails(qrId)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading payment details...</p>
      </div>
    )
  }

  if (fetchError || !qrPayment) {
    return (
      <PaymentError
        title="Payment Not Available"
        message={fetchError || 'The payment details could not be loaded'}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const handleConfirm = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

      if (!user?.uid) {
        const message = 'Please log in as a customer before making this payment.'
        setError(message)
        addToast(message, 'error')
        return
      }

      const customerResponse = await customerService.getCustomerByUid(user.uid)
      if (!customerResponse.success || !customerResponse.data) {
        const message = 'Customer wallet profile not found. Ask an admin to create or top up your wallet.'
        setError(message)
        addToast(message, 'error')
        return
      }

      const result = await processPayment({
        qrId,
        customerId: customerResponse.data.id,
        customerEmail: user.email,
        amount: qrPayment.amount,
        currency: qrPayment.currency,
        paymentMethod: 'qr_code',
      })

      if (result.success && result.transactionId) {
        addToast('Payment processed successfully!', 'success')
        router.push(`/pay/${qrId}/success?txId=${result.transactionId}`)
      } else {
        setError(result.error || 'Failed to process payment')
        addToast(result.error || 'Payment failed', 'error')
      }
    } catch (err) {
      console.error('Payment confirmation error:', err)
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      addToast(message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <PaymentConfirmation
      qrPayment={qrPayment}
      isProcessing={isProcessing}
      error={error || undefined}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )
}

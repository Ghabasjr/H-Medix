'use client'

import { useParams, useRouter } from 'next/navigation'
import { PaymentDetails } from '@/components/payment/PaymentDetails'
import { PaymentError } from '@/components/payment/PaymentError'
import { Spinner } from '@/components/ui/spinner'
import { useQRPaymentDetails } from '@/lib/hooks/useQRPaymentDetails'

export default function PaymentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const qrId = params.qrId as string

  const { qrPayment, loading, error } = useQRPaymentDetails(qrId)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading payment details...</p>
      </div>
    )
  }

  if (error || !qrPayment) {
    return (
      <PaymentError
        title="Payment Not Available"
        message={error || 'The payment details could not be loaded'}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const handleContinue = () => {
    router.push(`/pay/${qrId}/confirm`)
  }

  return <PaymentDetails qrPayment={qrPayment} onContinue={handleContinue} />
}

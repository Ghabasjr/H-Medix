'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QRPayment } from '@/lib/db/models/qrPayment.types'
import { formatCurrency, formatDateTime } from '@/lib/utils/admin'
import { Store, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PaymentDetailsProps {
  qrPayment: QRPayment
  onContinue: () => void
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === 'object' && value && 'toDate' in value) {
    const timestamp = value as { toDate?: () => Date }
    if (typeof timestamp.toDate === 'function') return timestamp.toDate()
  }
  return new Date(value as string | number)
}

export function PaymentDetails({ qrPayment, onContinue }: PaymentDetailsProps) {
  const expiresAt = toDate(qrPayment.validUntil)
  const isExpired = expiresAt < new Date()
  const timeRemaining = Math.max(0, expiresAt.getTime() - Date.now())
  const minutesRemaining = Math.floor(timeRemaining / 60000)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-muted-foreground">Review the payment details below before confirming</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-accent" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p className="text-4xl font-bold text-accent">
              {formatCurrency(qrPayment.amount)}
            </p>
          </div>

          {/* Payment Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground">Payment Method</p>
              <p className="font-semibold">QR Code</p>
            </div>
            <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground">Currency</p>
              <p className="font-semibold">Nigerian Naira (₦)</p>
            </div>
          </div>

          {/* Expiration Status */}
          <div className={`p-4 rounded-lg border-2 ${isExpired ? 'border-destructive bg-destructive/5' : 'border-green-200 bg-green-50 dark:bg-green-900/20'}`}>
            <div className="flex items-start gap-3">
              <Clock className={`h-5 w-5 mt-0.5 ${isExpired ? 'text-destructive' : 'text-green-600'}`} />
              <div className="space-y-1">
                <p className="font-semibold">
                  {isExpired ? 'Payment Expired' : 'Payment Expires'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isExpired 
                    ? formatDateTime(expiresAt)
                    : `In ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment ID</span>
              <span className="text-sm font-mono">{qrPayment.id.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={qrPayment.status === 'active' ? 'default' : 'secondary'}>
                {qrPayment.status}
              </Badge>
            </div>
          </div>

          {/* Action */}
          {!isExpired && (
            <Button
              size="lg"
              className="w-full"
              onClick={onContinue}
            >
              Continue to Confirm Payment
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Your payment is secure and encrypted
        </p>
        <Link href="/" className="text-sm text-accent hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

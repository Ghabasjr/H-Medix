'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { QRPayment } from '@/lib/db/models/qrPayment.types'
import { formatCurrency } from '@/lib/utils/admin'
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react'

interface PaymentConfirmationProps {
  qrPayment: QRPayment
  isProcessing: boolean
  error?: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function PaymentConfirmation({
  qrPayment,
  isProcessing,
  error,
  onConfirm,
  onCancel,
}: PaymentConfirmationProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Confirm Your Payment</h1>
        <p className="text-muted-foreground">Review and confirm the payment details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount */}
          <div className="text-center space-y-2 py-4">
            <p className="text-sm text-muted-foreground">You are about to pay</p>
            <p className="text-5xl font-bold text-accent">
              {formatCurrency(qrPayment.amount, qrPayment.currency)}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Details */}
          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold">QR Code Payment</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-semibold">Nigerian Naira (₦)</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-destructive">Payment Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={isProcessing}
                className="mt-1 rounded"
              />
              <span className="text-sm">
                I confirm that I want to pay {formatCurrency(qrPayment.amount, qrPayment.currency)} for this transaction
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={onConfirm}
              disabled={!agreed || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Spinner size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Confirm Payment
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

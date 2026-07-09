'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/db/models/transaction.types'
import { formatCurrency, formatDateTime } from '@/lib/utils/admin'
import { CheckCircle, Download, Home, Printer } from 'lucide-react'
import Link from 'next/link'

interface PaymentSuccessProps {
  transaction: Transaction
  onPrint: () => void
  onDownload: () => void
}

export function PaymentSuccess({
  transaction,
  onPrint,
  onDownload,
}: PaymentSuccessProps) {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-md opacity-75" />
            <CheckCircle className="h-20 w-20 text-green-600 relative" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground">
          Your payment has been processed successfully
        </p>
      </div>

      {/* Receipt Card */}
      <Card className="border-2">
        <CardContent className="p-8 space-y-6">
          {/* Amount */}
          <div className="text-center space-y-2 py-4 border-b">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-5xl font-bold text-accent">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm break-all">{transaction.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold text-green-600">Completed</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="font-semibold">{transaction.paymentMethod}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="text-sm">{formatDateTime(transaction.createdAt)}</p>
              </div>
            </div>

            {/* Additional Info */}
            {transaction.customerEmail && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{transaction.customerEmail}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrint}
              className="gap-2"
            >
              <Printer className="h-5 w-5" />
              Print
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onDownload}
              className="gap-2"
            >
              <Download className="h-5 w-5" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Message */}
      <div className="text-center space-y-3 p-4 bg-secondary/50 rounded-lg">
        <p className="text-sm">
          A receipt has been sent to your email. Keep it for your records.
        </p>
        <p className="text-xs text-muted-foreground">
          Your payment is secure and encrypted with industry-standard SSL security
        </p>
      </div>

      {/* Return Button */}
      <div className="pt-4">
        <Link href="/dashboard/customer" className="w-full">
          <Button size="lg" className="w-full gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

interface PaymentErrorProps {
  title: string
  message: string
  errorCode?: string
  onRetry?: () => void
}

export function PaymentError({
  title,
  message,
  errorCode,
  onRetry,
}: PaymentErrorProps) {
  return (
    <div className="space-y-6">
      {/* Error Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>

      {/* Error Details */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">What happened?</p>
            <p className="text-sm font-mono bg-background p-3 rounded border">
              {message}
            </p>
            {errorCode && (
              <p className="text-xs text-muted-foreground">Error Code: {errorCode}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        {onRetry && (
          <Button
            size="lg"
            className="w-full"
            onClick={onRetry}
            variant="default"
          >
            Try Again
          </Button>
        )}
        <Link href="/dashboard/customer" className="w-full block">
          <Button
            size="lg"
            className="w-full gap-2"
            variant={onRetry ? 'outline' : 'default'}
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Help Info */}
      <div className="text-center space-y-2 p-4 bg-secondary/50 rounded-lg">
        <p className="text-sm font-semibold">Need Help?</p>
        <p className="text-xs text-muted-foreground">
          If this error persists, please contact customer support
        </p>
      </div>
    </div>
  )
}

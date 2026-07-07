'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

interface PaymentStatusCardProps {
  pendingCount: number
  activeQRCount: number
  failedCount: number
}

export function PaymentStatusCard({
  pendingCount,
  activeQRCount,
  failedCount,
}: PaymentStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <Badge variant="secondary">{pendingCount}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Active QR</span>
          </div>
          <Badge variant="default">{activeQRCount}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Failed</span>
          </div>
          <Badge variant="destructive">{failedCount}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

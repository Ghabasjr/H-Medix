'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/admin'

interface TodaysSalesCardProps {
  totalSales: number
  transactionCount: number
  averageAmount: number
  currency?: string
}

export function TodaysSalesCard({
  totalSales,
  transactionCount,
  averageAmount,
  currency = 'NGN',
}: TodaysSalesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today&apos;s Sales</CardTitle>
        <TrendingUp className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold">{formatCurrency(totalSales, currency)}</p>
          <p className="text-xs text-muted-foreground">Total revenue</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{transactionCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average</p>
            <p className="text-2xl font-bold">{formatCurrency(averageAmount, currency)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

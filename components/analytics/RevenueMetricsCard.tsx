'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { DailyMetrics } from '@/lib/services/reporting/reportAggregation'
import { formatCurrency } from '@/lib/utils/admin'

interface RevenueMetricsCardProps {
  metrics: DailyMetrics
  previousMetrics?: DailyMetrics
}

export function RevenueMetricsCard({ metrics, previousMetrics }: RevenueMetricsCardProps) {
  const revenueTrend = previousMetrics
    ? ((metrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) * 100
    : 0
  const isPositive = revenueTrend >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-bold">${metrics.totalRevenue.toFixed(2)}</div>
          {previousMetrics && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {isPositive ? '+' : ''}{revenueTrend.toFixed(1)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.totalTransactions}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.completedTransactions} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${metrics.averageTransactionValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.successRate.toFixed(1)}%</div>
          <Badge variant={metrics.successRate >= 95 ? 'default' : 'secondary'} className="mt-2">
            {metrics.successRate >= 95 ? 'Excellent' : 'Good'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

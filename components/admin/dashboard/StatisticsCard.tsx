'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatisticsCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export function StatisticsCard({
  title,
  value,
  unit,
  icon,
  trend,
  description,
}: StatisticsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{value}</h3>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
          {icon}
        </div>
      </div>
    </Card>
  )
}

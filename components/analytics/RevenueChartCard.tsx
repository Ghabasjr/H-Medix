'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { RevenueChartData } from '@/lib/services/reporting/reportAggregation'

interface RevenueChartCardProps {
  data: RevenueChartData[]
  title: string
  chartType?: 'line' | 'area'
}

export function RevenueChartCard({ data, title, chartType = 'area' }: RevenueChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

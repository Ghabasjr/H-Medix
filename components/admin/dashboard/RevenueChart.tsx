'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: Array<{
    date: string
    revenue: number
  }>
  title?: string
}

export function RevenueChart({ data, title = 'Revenue Trend' }: RevenueChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ fill: 'var(--accent)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

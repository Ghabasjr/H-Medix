'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TransactionsChartProps {
  data: Array<{
    name: string
    count: number
  }>
  title?: string
}

export function TransactionsChart({ data, title = 'Transactions by Status' }: TransactionsChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            formatter={(value) => [value, 'Transactions']}
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

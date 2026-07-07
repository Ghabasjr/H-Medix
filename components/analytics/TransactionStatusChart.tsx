'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface TransactionStatus {
  name: string
  count: number
  percentage: number
}

interface TransactionStatusChartProps {
  data: TransactionStatus[]
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export function TransactionStatusChart({ data }: TransactionStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} transactions`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopCustomer } from '@/lib/services/reporting/reportAggregation'
import { formatCurrency } from '@/lib/utils/admin'
import { Crown } from 'lucide-react'

interface TopCustomersCardProps {
  customers: TopCustomer[]
}

export function TopCustomersCard({ customers }: TopCustomersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Top Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No customer data available</p>
          ) : (
            customers.map((customer, index) => (
              <div key={customer.customerId} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.transactionCount} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${customer.totalSpent.toFixed(2)}</p>
                  {index === 0 && <Badge className="mt-1">VIP</Badge>}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

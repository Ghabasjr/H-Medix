'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { StatisticsCard } from '@/components/admin/dashboard/StatisticsCard'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { TransactionsChart } from '@/components/admin/dashboard/TransactionsChart'
import { DataTable } from '@/components/admin/management/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CreditCard, TrendingUp, Activity, Zap, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { formatCurrency, formatDateTime } from '@/lib/utils/admin'

export default function AdminDashboard() {
  const [revenueData, setRevenueData] = useState([
    { date: 'Jan 1', revenue: 2400 },
    { date: 'Jan 2', revenue: 3210 },
    { date: 'Jan 3', revenue: 2290 },
    { date: 'Jan 4', revenue: 2000 },
    { date: 'Jan 5', revenue: 2181 },
    { date: 'Jan 6', revenue: 2500 },
  ])

  const [transactionData, setTransactionData] = useState([
    { name: 'Completed', count: 425 },
    { name: 'Pending', count: 32 },
    { name: 'Failed', count: 12 },
  ])

  const { transactions, loading: transLoading } = useTransactions()
  const { data: users, loading: usersLoading } = useFirestore('users')

  const completedTransactions = transactions
    .filter((t: any) => t.status === 'completed')
    .slice(0, 5)

  const totalRevenue = transactions
    .filter((t: any) => t.status === 'completed')
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your system overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticsCard
            title="Total Users"
            value={users?.length || 0}
            icon={<Users className="h-6 w-6 text-accent" />}
            description="Active system users"
            trend={{ value: 12, isPositive: true }}
          />

          <StatisticsCard
            title="Total Transactions"
            value={transactions?.length || 0}
            icon={<CreditCard className="h-6 w-6 text-accent" />}
            description="All-time transactions"
            trend={{ value: 8, isPositive: true }}
          />

          <StatisticsCard
            title="Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<TrendingUp className="h-6 w-6 text-accent" />}
            description="Completed transactions"
            trend={{ value: 23, isPositive: true }}
          />

          <StatisticsCard
            title="Success Rate"
            value={transactions.length > 0 ? `${Math.round((transactions.filter((t: any) => t.status === 'completed').length / transactions.length) * 100)}%` : '0%'}
            icon={<Activity className="h-6 w-6 text-accent" />}
            description="Transaction completion"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueData} />
          <TransactionsChart data={transactionData} />
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <DataTable
            columns={[
              { header: 'ID', key: 'id', width: 'w-20' },
              {
                header: 'Amount',
                key: 'amount',
                render: (value) => formatCurrency(value || 0)
              },
              {
                header: 'Status',
                key: 'status',
                render: (value) => (
                  <Badge variant={value === 'completed' ? 'default' : value === 'pending' ? 'secondary' : 'destructive'}>
                    {value}
                  </Badge>
                )
              },
              {
                header: 'Date',
                key: 'createdAt',
                render: (value) => formatDateTime(value || new Date())
              },
            ]}
            data={completedTransactions}
            isLoading={transLoading}
            emptyMessage="No transactions yet"
          />
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Uptime</p>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-green-600">Excellent</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Response Time</p>
              <p className="text-2xl font-bold">145ms</p>
              <p className="text-xs text-green-600">Optimal</p>
            </div>
            <div className="space-y-2 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

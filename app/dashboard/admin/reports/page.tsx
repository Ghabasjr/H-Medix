'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ManagementPageLayout } from '@/components/admin/management/ManagementPageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RevenueChartCard } from '@/components/analytics/RevenueChartCard'
import { TransactionStatusChart } from '@/components/analytics/TransactionStatusChart'
import { RevenueMetricsCard } from '@/components/analytics/RevenueMetricsCard'
import { TopCustomersCard } from '@/components/analytics/TopCustomersCard'
import { ReportHeader } from '@/components/reporting/ReportHeader'
import { DateRangePicker } from '@/components/reporting/DateRangePicker'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { ActivityLogTable } from '@/components/activitylog/ActivityLogTable'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { useFirestore } from '@/lib/hooks/useFirestore'
import {
  useDailyReport,
  useWeeklyReport,
  useMonthlyReport,
  useTopCustomers,
  useRevenueChart,
  useTransactionStatusDistribution
} from '@/lib/hooks/useReportData'
import {
  transactionsToCSV,
  downloadCSV,
  topCustomersToCSV,
  dailyMetricsToCSV,
} from '@/lib/utils/export/csvExport'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency } from '@/lib/utils/admin'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date
  })
  const [endDate, setEndDate] = useState(new Date())
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [isExporting, setIsExporting] = useState(false)
  const { addToast } = useToast()

  // Hooks
  const { transactions, loading: txLoading } = useTransactions()
  const { report: dailyReport } = useDailyReport(new Date())
  const { report: weeklyReport } = useWeeklyReport(startDate)
  const { report: monthlyReport } = useMonthlyReport(startDate.getFullYear(), startDate.getMonth())
  const { topCustomers } = useTopCustomers(10)
  const { data: revenueData } = useRevenueChart(startDate, endDate)
  const { distribution: statusDistribution } = useTransactionStatusDistribution()
  const { data: notifications } = useFirestore('notifications', [])
  const { data: auditLogs } = useFirestore('auditLogs', [])

  const completedTransactions = transactions.filter((t: any) => t.status === 'completed')
  const totalRevenue = completedTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0)


  const handleQuickSelect = (range: 'today' | 'week' | 'month') => {
    const now = new Date()
    if (range === 'today') {
      setStartDate(new Date(now))
      setEndDate(new Date(now))
    } else if (range === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      setStartDate(weekAgo)
      setEndDate(now)
    } else if (range === 'month') {
      const monthAgo = new Date(now)
      monthAgo.setDate(monthAgo.getDate() - 30)
      setStartDate(monthAgo)
      setEndDate(now)
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)

      if (reportType === 'daily' && dailyReport) {
        const csv = dailyMetricsToCSV([dailyReport])
        downloadCSV(`daily-report-${new Date().toISOString().split('T')[0]}.csv`, csv)
      } else if (transactions.length > 0) {
        const csv = transactionsToCSV(transactions)
        downloadCSV(`transactions-${new Date().toISOString().split('T')[0]}.csv`, csv)
      }

      addToast('Report exported successfully', 'success')
    } catch (error) {
      console.error('Export error:', error)
      addToast('Failed to export report', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
    addToast('Opening print dialog...', 'success')
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <ManagementPageLayout
        title="Reports & Analytics"
        description="Real-time analytics and performance reports"
        actions={
          <Button size="sm" onClick={handleExport} disabled={isExporting} className="gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Report Header */}
          <ReportHeader
            title="Analytics Dashboard"
            description="Real-time insights into your payment system"
            onExport={handleExport}
            onPrint={handlePrint}
            isExporting={isExporting}
          />

          {/* Date Range Picker */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onQuickSelect={handleQuickSelect}
          />

          {/* Report Type Tabs */}
          <Tabs value={reportType} onValueChange={(v: any) => setReportType(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily Report</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-6 mt-6">
              {dailyReport && <RevenueMetricsCard metrics={dailyReport} />}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-6 mt-6">
              {weeklyReport && <RevenueMetricsCard metrics={weeklyReport} />}
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6 mt-6">
              {monthlyReport && <RevenueMetricsCard metrics={monthlyReport} />}
            </TabsContent>
          </Tabs>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChartCard
              data={revenueData}
              title="Revenue Trend"
              chartType="area"
            />
            <TransactionStatusChart data={statusDistribution} />
          </div>

          {/* Top Customers */}
          <TopCustomersCard customers={topCustomers} />

          {/* Notifications & Activity Log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotificationCenter
              notifications={notifications || []}
            />
            <ActivityLogTable
              logs={auditLogs || []}
              loading={false}
            />
          </div>

          {/* Additional Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Transaction Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(
                    completedTransactions.length > 0
                      ? totalRevenue / completedTransactions.length
                      : 0
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Based on {completedTransactions.length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span className="font-semibold text-green-600">{completedTransactions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending:</span>
                    <span className="font-semibold text-yellow-600">
                      {transactions.filter((t: any) => t.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failed:</span>
                    <span className="font-semibold text-red-600">
                      {transactions.filter((t: any) => t.status === 'failed').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

import { Transaction } from '@/lib/db/models/transaction.types'
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics, TopCustomer } from '@/lib/services/reporting/reportAggregation'

/**
 * Convert transactions to CSV format
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    'Transaction ID',
    'Amount',
    'Currency',
    'Status',
    'Payment Method',
    'Date',
    'Customer ID',
  ]

  const rows = transactions.map((t) => [
    t.id,
    t.amount.toString(),
    t.currency,
    t.status,
    t.paymentMethod,
    new Date(t.createdAt).toISOString(),
    t.customerId,
  ])

  return csvFormat(headers, rows)
}

/**
 * Convert daily metrics to CSV format
 */
export function dailyMetricsToCSV(metrics: DailyMetrics[]): string {
  const headers = [
    'Date',
    'Total Transactions',
    'Completed',
    'Failed',
    'Total Revenue',
    'Average Value',
    'Success Rate (%)',
  ]

  const rows = metrics.map((m) => [
    m.date,
    m.totalTransactions.toString(),
    m.completedTransactions.toString(),
    m.failedTransactions.toString(),
    m.totalRevenue.toFixed(2),
    m.averageTransactionValue.toFixed(2),
    m.successRate.toFixed(2),
  ])

  return csvFormat(headers, rows)
}

/**
 * Convert weekly metrics to CSV format
 */
export function weeklyMetricsToCSV(metrics: WeeklyMetrics[]): string {
  const headers = [
    'Week',
    'Total Transactions',
    'Completed',
    'Failed',
    'Total Revenue',
    'Average Value',
    'Success Rate (%)',
  ]

  const rows = metrics.map((m) => [
    m.week,
    m.totalTransactions.toString(),
    m.completedTransactions.toString(),
    m.failedTransactions.toString(),
    m.totalRevenue.toFixed(2),
    m.averageTransactionValue.toFixed(2),
    m.successRate.toFixed(2),
  ])

  return csvFormat(headers, rows)
}

/**
 * Convert monthly metrics to CSV format
 */
export function monthlyMetricsToCSV(metrics: MonthlyMetrics[]): string {
  const headers = [
    'Month',
    'Total Transactions',
    'Completed',
    'Failed',
    'Total Revenue',
    'Average Value',
    'Success Rate (%)',
  ]

  const rows = metrics.map((m) => [
    m.month,
    m.totalTransactions.toString(),
    m.completedTransactions.toString(),
    m.failedTransactions.toString(),
    m.totalRevenue.toFixed(2),
    m.averageTransactionValue.toFixed(2),
    m.successRate.toFixed(2),
  ])

  return csvFormat(headers, rows)
}

/**
 * Convert top customers to CSV format
 */
export function topCustomersToCSV(customers: TopCustomer[]): string {
  const headers = ['Customer ID', 'Email', 'Total Spent', 'Transactions', 'Last Transaction']

  const rows = customers.map((c) => [
    c.customerId,
    c.email || 'N/A',
    c.totalSpent.toFixed(2),
    c.transactionCount.toString(),
    new Date(c.lastTransactionDate).toISOString(),
  ])

  return csvFormat(headers, rows)
}

/**
 * Generic CSV formatter
 */
function csvFormat(headers: string[], rows: string[][]): string {
  const headerRow = headers.map(escapeCSV).join(',')
  const dataRows = rows.map((row) => row.map(escapeCSV).join(',')).join('\n')
  return `${headerRow}\n${dataRows}`
}

/**
 * Escape special characters for CSV
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Download CSV file
 */
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

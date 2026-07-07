import { Transaction } from '@/lib/db/models/transaction.types'
import { Customer } from '@/lib/db/models/customer.types'

export interface DailyMetrics {
  date: string
  totalTransactions: number
  completedTransactions: number
  failedTransactions: number
  totalRevenue: number
  averageTransactionValue: number
  successRate: number
}

export interface WeeklyMetrics extends DailyMetrics {
  week: string
  dayBreakdown: DailyMetrics[]
}

export interface MonthlyMetrics extends DailyMetrics {
  month: string
  weekBreakdown: WeeklyMetrics[]
}

export interface TopCustomer {
  customerId: string
  name: string
  email?: string
  totalSpent: number
  transactionCount: number
  lastTransactionDate: Date
}

export interface RevenueChartData {
  date: string
  revenue: number
  transactions: number
}

/**
 * Calculate metrics for a specific date range
 */
export function calculateMetrics(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): DailyMetrics {
  const filtered = transactions.filter((t) => {
    const txDate = new Date(t.createdAt)
    return txDate >= startDate && txDate <= endDate && t.status === 'completed'
  })

  const total = transactions.filter((t) => {
    const txDate = new Date(t.createdAt)
    return txDate >= startDate && txDate <= endDate
  })

  const completed = filtered.length
  const failed = total.filter((t) => t.status === 'failed').length
  const totalRevenue = filtered.reduce((sum, t) => sum + (t.amount || 0), 0)
  const avgValue = completed > 0 ? totalRevenue / completed : 0
  const successRate = total.length > 0 ? (completed / total.length) * 100 : 0

  return {
    date: startDate.toISOString().split('T')[0],
    totalTransactions: total.length,
    completedTransactions: completed,
    failedTransactions: failed,
    totalRevenue,
    averageTransactionValue: avgValue,
    successRate,
  }
}

/**
 * Generate daily report for a specific day
 */
export function generateDailyReport(
  transactions: Transaction[],
  date: Date
): DailyMetrics {
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)

  return calculateMetrics(transactions, startDate, endDate)
}

/**
 * Generate weekly report with daily breakdown
 */
export function generateWeeklyReport(
  transactions: Transaction[],
  startDate: Date
): WeeklyMetrics {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)
  endDate.setHours(23, 59, 59, 999)

  const weekStart = startDate.toISOString().split('T')[0]
  const weekEnd = endDate.toISOString().split('T')[0]

  const metrics = calculateMetrics(transactions, startDate, endDate)
  const dayBreakdown: DailyMetrics[] = []

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    dayBreakdown.push(generateDailyReport(transactions, currentDate))
  }

  return {
    ...metrics,
    week: `${weekStart} to ${weekEnd}`,
    dayBreakdown,
  }
}

/**
 * Generate monthly report with weekly breakdown
 */
export function generateMonthlyReport(
  transactions: Transaction[],
  year: number,
  month: number
): MonthlyMetrics {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  endDate.setHours(23, 59, 59, 999)

  const monthStr = startDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const metrics = calculateMetrics(transactions, startDate, endDate)
  const weekBreakdown: WeeklyMetrics[] = []

  let currentWeekStart = new Date(startDate)
  while (currentWeekStart <= endDate) {
    if (currentWeekStart.getMonth() === month) {
      weekBreakdown.push(generateWeeklyReport(transactions, currentWeekStart))
    }
    currentWeekStart.setDate(currentWeekStart.getDate() + 7)
  }

  return {
    ...metrics,
    month: monthStr,
    weekBreakdown,
  }
}

/**
 * Get top customers by revenue
 */
export function getTopCustomers(
  customers: Customer[],
  limit: number = 10
): TopCustomer[] {
  return customers
    .map((c) => ({
      customerId: c.id,
      name: c.email?.split('@')[0] || 'Unknown',
      email: c.email,
      totalSpent: c.totalSpent || 0,
      transactionCount: c.transactionCount || 0,
      lastTransactionDate: new Date(c.lastTransactionAt || new Date()),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
}

/**
 * Generate revenue chart data for line/area charts
 */
export function generateRevenueChartData(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'week' = 'day'
): RevenueChartData[] {
  const data: { [key: string]: RevenueChartData } = {}

  transactions
    .filter((t) => {
      const txDate = new Date(t.createdAt)
      return txDate >= startDate && txDate <= endDate && t.status === 'completed'
    })
    .forEach((transaction) => {
      const txDate = new Date(transaction.createdAt)
      let key: string

      if (groupBy === 'day') {
        key = txDate.toISOString().split('T')[0]
      } else {
        // Week grouping
        const weekStart = new Date(txDate)
        weekStart.setDate(txDate.getDate() - txDate.getDay())
        key = weekStart.toISOString().split('T')[0]
      }

      if (!data[key]) {
        data[key] = {
          date: key,
          revenue: 0,
          transactions: 0,
        }
      }

      data[key].revenue += transaction.amount || 0
      data[key].transactions += 1
    })

  return Object.values(data).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Get transaction status distribution
 */
export function getTransactionStatusDistribution(transactions: Transaction[]) {
  const distribution = {
    completed: 0,
    pending: 0,
    failed: 0,
  }

  transactions.forEach((t) => {
    if (t.status === 'completed') distribution.completed++
    else if (t.status === 'pending') distribution.pending++
    else if (t.status === 'failed') distribution.failed++
  })

  return [
    { name: 'Completed', count: distribution.completed, percentage: 0 },
    { name: 'Pending', count: distribution.pending, percentage: 0 },
    { name: 'Failed', count: distribution.failed, percentage: 0 },
  ].map((item) => ({
    ...item,
    percentage: transactions.length > 0 ? (item.count / transactions.length) * 100 : 0,
  }))
}

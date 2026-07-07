'use client'

import { useState, useEffect } from 'react'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { useFirestore } from '@/lib/hooks/useFirestore'
import {
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
  getTopCustomers,
  generateRevenueChartData,
  getTransactionStatusDistribution,
  type DailyMetrics,
  type WeeklyMetrics,
  type MonthlyMetrics,
  type TopCustomer,
  type RevenueChartData,
} from '@/lib/services/reporting/reportAggregation'
import { Customer } from '@/lib/db/models/customer.types'

export function useDailyReport(date: Date) {
  const { transactions, loading } = useTransactions()
  const [report, setReport] = useState<DailyMetrics | null>(null)

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      const dailyReport = generateDailyReport(transactions, date)
      setReport(dailyReport)
    }
  }, [transactions, loading, date])

  return { report, loading }
}

export function useWeeklyReport(startDate: Date) {
  const { transactions, loading } = useTransactions()
  const [report, setReport] = useState<WeeklyMetrics | null>(null)

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      const weeklyReport = generateWeeklyReport(transactions, startDate)
      setReport(weeklyReport)
    }
  }, [transactions, loading, startDate])

  return { report, loading }
}

export function useMonthlyReport(year: number, month: number) {
  const { transactions, loading } = useTransactions()
  const [report, setReport] = useState<MonthlyMetrics | null>(null)

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      const monthlyReport = generateMonthlyReport(transactions, year, month)
      setReport(monthlyReport)
    }
  }, [transactions, loading, year, month])

  return { report, loading }
}

export function useTopCustomers(limit: number = 10) {
  const { data: customers, loading } = useFirestore('customers', [])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])

  useEffect(() => {
    if (!loading && customers.length > 0) {
      const top = getTopCustomers(customers as Customer[], limit)
      setTopCustomers(top)
    }
  }, [customers, loading, limit])

  return { topCustomers, loading }
}

export function useRevenueChart(startDate: Date, endDate: Date, groupBy: 'day' | 'week' = 'day') {
  const { transactions, loading } = useTransactions()
  const [data, setData] = useState<RevenueChartData[]>([])

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      const chartData = generateRevenueChartData(transactions, startDate, endDate, groupBy)
      setData(chartData)
    }
  }, [transactions, loading, startDate, endDate, groupBy])

  return { data, loading }
}

export function useTransactionStatusDistribution() {
  const { transactions, loading } = useTransactions()
  const [distribution, setDistribution] = useState<any[]>([])

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      const dist = getTransactionStatusDistribution(transactions)
      setDistribution(dist)
    }
  }, [transactions, loading])

  return { distribution, loading }
}

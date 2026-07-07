'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TodaysSalesCard } from '@/components/cashier/dashboard/TodaysSalesCard'
import { PaymentStatusCard } from '@/components/cashier/dashboard/PaymentStatusCard'
import { GeneratePaymentModal } from '@/components/cashier/dashboard/GeneratePaymentModal'
import { TransactionHistoryTable } from '@/components/cashier/dashboard/TransactionHistoryTable'
import { QrCode } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { printReceipt, downloadReceiptAsText } from '@/lib/utils/receipt/receiptFormatter'
import { useToast } from '@/contexts/ToastContext'

export default function CashierDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { transactions, loading: transLoading } = useTransactions(user?.storeId)

  // Get today's transactions
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysTransactions = transactions.filter((t: any) => {
    const txDate = new Date(t.createdAt)
    txDate.setHours(0, 0, 0, 0)
    return txDate.getTime() === today.getTime()
  })

  const completedToday = todaysTransactions.filter((t: any) => t.status === 'completed')
  const totalSalestoday = completedToday.reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
  const avgAmount = completedToday.length > 0 ? totalSalestoday / completedToday.length : 0

  const pendingTransactions = transactions.filter((t: any) => t.status === 'pending')
  const failedTransactions = transactions.filter((t: any) => t.status === 'failed')

  const handlePrintReceipt = (transactionId: string) => {
    const transaction = transactions.find((t: any) => t.id === transactionId)
    if (!transaction) {
      addToast('Transaction not found', 'error')
      return
    }

    try {
      printReceipt({
        transactionId: transaction.id,
        amount: transaction.amount || 0,
        currency: transaction.currency || 'NGN',
        status: transaction.status,
        timestamp: transaction.createdAt,
        cashierName: user?.name || 'Cashier',
        storeName: 'Store Name',
        customerEmail: transaction.customerId,
        paymentMethod: transaction.paymentMethod || 'QR Code',
      })
      addToast('Receipt printed', 'success')
    } catch (error) {
      console.error('Print error:', error)
      addToast('Failed to print receipt', 'error')
    }
  }

  return (
    <ProtectedRoute requiredRoles={['cashier']}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cashier Dashboard</h1>
            <p className="text-muted-foreground mt-2">Generate and manage QR payments</p>
          </div>
          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <QrCode className="h-5 w-5" />
            Generate QR Code
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TodaysSalesCard
            totalSales={totalSalestoday}
            transactionCount={completedToday.length}
            averageAmount={avgAmount}
            currency="NGN"
          />

          <PaymentStatusCard
            pendingCount={pendingTransactions.length}
            activeQRCount={Math.max(0, transactions.length - completedToday.length - failedTransactions.length)}
            failedCount={failedTransactions.length}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {transactions.length > 0
                    ? `${Math.round((completedToday.length / transactions.length) * 100)}%`
                    : '0%'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Transaction History</h2>
            <p className="text-sm text-muted-foreground">View and manage all your transactions</p>
          </div>
          <TransactionHistoryTable
            transactions={transactions}
            isLoading={transLoading}
            onPrintReceipt={handlePrintReceipt}
          />
        </div>
      </div>

      {/* Generate Payment Modal */}
      <GeneratePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeId={user?.storeId || ''}
        cashierId={user?.id || ''}
        storeName="Your Store"
      />
    </ProtectedRoute>
  )
}

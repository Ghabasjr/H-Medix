'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ManagementPageLayout } from '@/components/admin/management/ManagementPageLayout'
import { SearchInput } from '@/components/admin/management/SearchInput'
import { PaginationControls } from '@/components/admin/management/PaginationControls'
import { DataTable } from '@/components/admin/management/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { customerService } from '@/lib/db/services/customerService'
import { formatCurrency, formatDate } from '@/lib/utils/admin'
import { MoreHorizontal, X, Wallet } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface Customer {
  id: string
  name?: string
  email?: string
  phone?: string
  walletBalance: number
  totalSpent: number
  transactionCount: number
  status: string
  createdAt: any
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [isTopingUp, setIsTopingUp] = useState(false)
  const { addToast } = useToast()

  const { data: customers, loading, refetch } = useFirestore('customers', [])

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter((customer: any) =>
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
    )
  }, [customers, searchTerm])

  const totalPages = Math.ceil(filteredCustomers.length / pageSize)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleTopUp = async (customerId: string, amount: number) => {
    if (amount <= 0) {
      addToast('Please enter a valid amount', 'error')
      return
    }

    setIsTopingUp(true)
    try {
      const response = await customerService.topUpWallet(customerId, amount)
      if (response.success) {
        addToast(`₦${amount.toLocaleString()} added to customer wallet`, 'success')
        setTopUpAmount('')
        setSelectedCustomer(null)
        refetch?.()
      } else {
        addToast(response.error || 'Failed to add funds', 'error')
      }
    } catch (error) {
      addToast('Error adding funds to wallet', 'error')
      console.error('Top-up error:', error)
    } finally {
      setIsTopingUp(false)
    }
  }

  const quickTopUp = async (customerId: string) => {
    await handleTopUp(customerId, 50000)
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <ManagementPageLayout
        title="Customers Management"
        description="View and manage customer accounts and transactions"
      >
        <div className="space-y-4">
          <SearchInput
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <DataTable
            columns={[
              { header: 'Name', key: 'name' },
              { header: 'Email', key: 'email' },
              { header: 'Phone', key: 'phone' },
              {
                header: 'Wallet Balance',
                key: 'walletBalance',
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">₦{(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                ),
              },
              {
                header: 'Total Spent',
                key: 'totalSpent',
                render: (value) => formatCurrency(value || 0),
              },
              {
                header: 'Transactions',
                key: 'transactionCount',
                render: (value) => value || 0,
              },
              {
                header: 'Status',
                key: 'status',
                render: (value) => (
                  <Badge variant={value === 'active' ? 'default' : 'destructive'}>
                    {value}
                  </Badge>
                ),
              },
              {
                header: 'Joined',
                key: 'createdAt',
                render: (value) => formatDate(value || new Date()),
              },
              {
                header: 'Actions',
                key: 'id',
                render: (id, row) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(row as Customer)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
            data={paginatedCustomers}
            isLoading={loading}
            emptyMessage="No customers found"
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={filteredCustomers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Customer Details & Top-Up</CardTitle>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 rounded hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-3 border-b pb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedCustomer.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm">{selectedCustomer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedCustomer.phone || 'N/A'}</p>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">Current Wallet Balance</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ₦{(selectedCustomer.walletBalance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Top-Up Section */}
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <label className="text-sm font-medium">Add Funds to Wallet</label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Enter amount (₦)"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        min="0"
                        disabled={isTopingUp}
                      />
                      <Button
                        onClick={() => {
                          const amount = parseFloat(topUpAmount)
                          handleTopUp(selectedCustomer.id, amount)
                        }}
                        disabled={isTopingUp || !topUpAmount.trim()}
                        className="gap-2"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Quick Top-Up Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTopUpAmount('10000')
                      }}
                      disabled={isTopingUp}
                    >
                      ₦10,000
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTopUpAmount('25000')
                      }}
                      disabled={isTopingUp}
                    >
                      ₦25,000
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTopUpAmount('50000')
                      }}
                      disabled={isTopingUp}
                    >
                      ₦50,000 (Demo)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTopUpAmount('100000')
                      }}
                      disabled={isTopingUp}
                    >
                      ₦100,000
                    </Button>
                  </div>

                  <Button
                    onClick={() => quickTopUp(selectedCustomer.id)}
                    className="w-full mt-2"
                    disabled={isTopingUp}
                  >
                    Quick Top-Up ₦50,000
                  </Button>
                </div>

                {/* Customer Stats */}
                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="font-semibold">₦{(selectedCustomer.totalSpent || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                    <p className="font-semibold">{selectedCustomer.transactionCount || 0}</p>
                  </div>
                </div>

                {/* Close Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

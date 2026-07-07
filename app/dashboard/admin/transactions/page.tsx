'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ManagementPageLayout } from '@/components/admin/management/ManagementPageLayout'
import { SearchInput } from '@/components/admin/management/SearchInput'
import { PaginationControls } from '@/components/admin/management/PaginationControls'
import { DataTable } from '@/components/admin/management/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { formatCurrency, formatDate } from '@/lib/utils/admin'
import { MoreHorizontal, Download } from 'lucide-react'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { transactions, loading } = useTransactions()
  const { data: stores } = useFirestore('stores', [])

  const storeMap = useMemo(
    () => new Map((stores || []).map((s: any) => [s.id, s.name])),
    [stores]
  )

  const filteredTransactions = useMemo(() => {
    let filtered = transactions || []

    if (searchTerm) {
      filtered = filtered.filter((tx: any) =>
        tx.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((tx: any) => tx.status === statusFilter)
    }

    return filtered
  }, [transactions, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <ManagementPageLayout
        title="Transactions Management"
        description="View and manage all payment transactions"
        actions={
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
            <SearchInput
              placeholder="Search by transaction ID..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="rounded border bg-background px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <DataTable
            columns={[
              { header: 'Transaction ID', key: 'id', width: 'w-32' },
              {
                header: 'Store',
                key: 'storeId',
                render: (value) => storeMap.get(value) || 'Unknown',
              },
              {
                header: 'Amount',
                key: 'amount',
                render: (value) => formatCurrency(value || 0),
              },
              {
                header: 'Status',
                key: 'status',
                render: (value) => {
                  const variants: Record<string, any> = {
                    completed: 'default',
                    pending: 'secondary',
                    failed: 'destructive',
                    refunded: 'outline',
                  }
                  return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
                },
              },
              {
                header: 'Payment Method',
                key: 'paymentMethod',
                render: (value) => value || 'QR Payment',
              },
              {
                header: 'Date',
                key: 'createdAt',
                render: (value) => formatDate(value || new Date()),
              },
              {
                header: 'Actions',
                key: 'id',
                render: () => (
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
            data={paginatedTransactions}
            isLoading={loading}
            emptyMessage="No transactions found"
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={filteredTransactions.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

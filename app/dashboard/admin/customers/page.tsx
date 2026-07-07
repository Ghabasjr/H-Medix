'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ManagementPageLayout } from '@/components/admin/management/ManagementPageLayout'
import { SearchInput } from '@/components/admin/management/SearchInput'
import { PaginationControls } from '@/components/admin/management/PaginationControls'
import { DataTable } from '@/components/admin/management/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { formatCurrency, formatDate } from '@/lib/utils/admin'
import { MoreHorizontal } from 'lucide-react'

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: customers, loading } = useFirestore('customers', [])

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
                render: () => (
                  <Button variant="ghost" size="sm">
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
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

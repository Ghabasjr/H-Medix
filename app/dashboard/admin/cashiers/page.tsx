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
import { formatDate } from '@/lib/utils/admin'
import { MoreHorizontal } from 'lucide-react'

export default function CashiersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: cashiers, loading } = useFirestore('cashiers', [])
  const { data: stores } = useFirestore('stores', [])

  const storeMap = useMemo(
    () => new Map((stores || []).map((s: any) => [s.id, s.name])),
    [stores]
  )

  const filteredCashiers = useMemo(() => {
    return (cashiers || []).filter((cashier: any) =>
      cashier.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.employeeId?.includes(searchTerm)
    )
  }, [cashiers, searchTerm])

  const totalPages = Math.ceil(filteredCashiers.length / pageSize)
  const paginatedCashiers = filteredCashiers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <ManagementPageLayout
        title="Cashiers Management"
        description="Manage cashier staff and their assignments"
        actions={
          <Button variant="default">Add Cashier</Button>
        }
      >
        <div className="space-y-4">
          <SearchInput
            placeholder="Search by name or employee ID..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <DataTable
            columns={[
              {
                header: 'Name',
                key: 'firstName',
                render: (value, row) => `${value} ${row.lastName || ''}`,
              },
              {
                header: 'Employee ID',
                key: 'employeeId',
              },
              {
                header: 'Store',
                key: 'storeId',
                render: (value) => storeMap.get(value) || 'Unknown',
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
                header: 'Hire Date',
                key: 'hireDate',
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
            data={paginatedCashiers}
            isLoading={loading}
            emptyMessage="No cashiers found"
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={filteredCashiers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

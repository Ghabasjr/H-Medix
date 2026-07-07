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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: users, loading } = useFirestore('users', [])

  const filteredUsers = useMemo(() => {
    return (users || []).filter((user: any) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <ManagementPageLayout
        title="Users Management"
        description="Manage system users and their roles"
        actions={
          <Button variant="default">Add User</Button>
        }
      >
        <div className="space-y-4">
          <SearchInput
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <DataTable
            columns={[
              { header: 'Email', key: 'email' },
              { header: 'Name', key: 'displayName' },
              {
                header: 'Role',
                key: 'role',
                render: (value) => (
                  <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
                    {value}
                  </Badge>
                ),
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
            data={paginatedUsers}
            isLoading={loading}
            emptyMessage="No users found"
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={filteredUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'

interface Column {
  header: string
  key: string
  render?: (value: any, row: any) => ReactNode
  width?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  isLoading?: boolean
  emptyMessage?: string
  rowClassName?: string
}

export function DataTable({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  rowClassName,
}: DataTableProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">{emptyMessage}</div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left font-medium text-muted-foreground ${
                    column.width ? column.width : ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`border-b transition-colors hover:bg-muted/50 ${rowClassName || ''}`}
              >
                {columns.map((column) => {
                  const value = row[column.key]
                  const content = column.render ? column.render(value, row) : value

                  return (
                    <td key={`${row.id || idx}-${column.key}`} className="px-4 py-3">
                      {content}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

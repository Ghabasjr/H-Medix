'use client'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  totalCount: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalCount,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded border bg-background px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-muted-foreground">
          Total: {totalCount} items
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 px-2">
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

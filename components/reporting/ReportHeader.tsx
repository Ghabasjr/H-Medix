'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Printer } from 'lucide-react'

interface ReportHeaderProps {
  title: string
  description: string
  onExport: () => void
  onPrint: () => void
  isExporting?: boolean
}

export function ReportHeader({
  title,
  description,
  onExport,
  onPrint,
  isExporting,
}: ReportHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              size="sm"
              onClick={onExport}
              disabled={isExporting}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

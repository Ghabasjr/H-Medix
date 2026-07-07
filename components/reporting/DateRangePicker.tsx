'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface DateRangePickerProps {
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
  onQuickSelect: (range: 'today' | 'week' | 'month') => void
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onQuickSelect,
}: DateRangePickerProps) {
  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Date Range</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formatDate(startDate)}
                onChange={(e) => onStartDateChange(new Date(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formatDate(endDate)}
                onChange={(e) => onEndDateChange(new Date(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Select</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickSelect('today')}
                >
                  Today
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickSelect('week')}
                >
                  Week
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickSelect('month')}
                >
                  Month
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

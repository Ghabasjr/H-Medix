'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuditLog } from '@/lib/db/models/auditLog.types'
import { formatDateTime } from '@/lib/utils/admin'
import { Activity } from 'lucide-react'

interface ActivityLogTableProps {
  logs: AuditLog[]
  loading?: boolean
}

export function ActivityLogTable({ logs, loading }: ActivityLogTableProps) {
  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'default'
    if (action.includes('update')) return 'secondary'
    if (action.includes('delete')) return 'destructive'
    return 'outline'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No activity recorded yet
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 bg-secondary/50 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{log.action}</p>
                      <Badge variant={getActionColor(log.action)} className="text-xs">
                        {log.collection}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.description}</p>
                    <p className="text-xs text-muted-foreground">
                      By {log.userId} • {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

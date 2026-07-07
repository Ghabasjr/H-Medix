'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Notification } from '@/lib/db/models/notification.types'
import { formatDateTime } from '@/lib/utils/admin'
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead?: (notificationId: string) => void
  onDismiss?: (notificationId: string) => void
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onDismiss,
}: NotificationCenterProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const unreadCount = notifications.filter((n) => n.status === 'unread').length
  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id))

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]))
    onDismiss?.(id)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {visibleNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No notifications yet
            </p>
          ) : (
            visibleNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.status === 'unread'
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-secondary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(notification.id)}
                        className="h-5 w-5 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(notification.createdAt)}
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

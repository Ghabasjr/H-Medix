'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants/app'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to role-specific dashboard if needed
    if (user?.role === 'admin') {
      router.push(ROUTES.DASHBOARD_ADMIN)
    } else if (user?.role === 'cashier') {
      router.push(ROUTES.DASHBOARD_CASHIER)
    } else if (user?.role === 'customer') {
      router.push(ROUTES.DASHBOARD_CUSTOMER)
    }
  }, [user, router])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to H-Medix Cashless Transaction System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/lib/constants/app'
import { UserRole } from '@/lib/auth/types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push(ROUTES.LOGIN)
      return
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.push(ROUTES.DASHBOARD)
      return
    }
  }, [user, loading, router, requiredRoles])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

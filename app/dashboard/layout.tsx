'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}

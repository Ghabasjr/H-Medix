'use client'

import type { ReactNode } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'

export default function LandingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <LandingNav />
      {children}
    </>
  )
}

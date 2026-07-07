'use client'

import { ReactNode } from 'react'

interface ManagementPageLayoutProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function ManagementPageLayout({
  title,
  description,
  actions,
  children,
}: ManagementPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

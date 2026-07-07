'use client'

import { ToastProvider as ToastContextProvider, useToast } from '@/contexts/ToastContext'
import { ToastComponent } from '@/components/ui/toast'
import { ReactNode } from 'react'

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastContextProvider>
      {children}
      <ToastContainer />
    </ToastContextProvider>
  )
}

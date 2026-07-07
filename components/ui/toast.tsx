'use client'

import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Toast, ToastType } from '@/contexts/ToastContext'

interface ToastComponentProps {
  toast: Toast
  onRemove: (id: string) => void
}

export function ToastComponent({ toast, onRemove }: ToastComponentProps) {
  const getToastStyles = (type: ToastType): { bg: string; text: string; icon: React.ReactNode } => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950',
          text: 'text-green-900 dark:text-green-100',
          icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950',
          text: 'text-red-900 dark:text-red-100',
          icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950',
          text: 'text-yellow-900 dark:text-yellow-100',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
        }
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          text: 'text-blue-900 dark:text-blue-100',
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        }
    }
  }

  const styles = getToastStyles(toast.type)

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${styles.bg} ${styles.text} border-current/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300`}
      role="alert"
    >
      {styles.icon}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 p-0.5 hover:bg-current/10 rounded transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

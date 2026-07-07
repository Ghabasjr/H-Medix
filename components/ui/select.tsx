import { cn } from '@/lib/utils'
import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  children: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, ...props }, ref) => (
  <select
    className={cn(
      'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    )}
    ref={ref}
    {...props}
  />
))
Select.displayName = 'Select'

export { Select }

import { cn } from '@/lib/utils'
import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }

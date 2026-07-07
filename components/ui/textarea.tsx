import { cn } from '@/lib/utils'
import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }

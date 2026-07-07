import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', {
  variants: {
    variant: {
      default: 'border border-primary/30 bg-primary/10 text-primary',
      success: 'border border-green-300 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-900 dark:text-green-200',
      warning: 'border border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'border border-red-300 bg-red-100 text-red-800 dark:border-red-600 dark:bg-red-900 dark:text-red-200',
      info: 'border border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-600 dark:bg-blue-900 dark:text-blue-200',
      pending: 'border border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200',
      secondary: 'border border-secondary/30 bg-secondary/10 text-secondary-foreground',
      destructive: 'border border-destructive/30 bg-destructive/10 text-destructive',
      outline: 'border border-input text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  children: ReactNode
}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

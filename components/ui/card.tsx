import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('rounded-lg border border-border bg-card text-card-foreground', className)} {...props} />
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h2 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

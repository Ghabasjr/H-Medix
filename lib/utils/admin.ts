export function formatCurrency(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (value && typeof value === 'object') {
    if (typeof (value as any).toDate === 'function') {
      return (value as any).toDate()
    }
    if (
      typeof (value as any).seconds === 'number' &&
      typeof (value as any).nanoseconds === 'number'
    ) {
      return new Date((value as any).seconds * 1000 + (value as any).nanoseconds / 1_000_000)
    }
  }

  const date = new Date(value as string | number)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(date: Date | string | number | Record<string, unknown> | null | undefined): string {
  const d = toDate(date)
  if (!d) return 'Invalid date'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(
  date: Date | string | number | Record<string, unknown> | null | undefined,
): string {
  const d = toDate(date)
  if (!d) return 'Invalid date'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800'
    case 'suspended':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function calculateTotalPages(totalCount: number, pageSize: number): number {
  return Math.ceil(totalCount / pageSize)
}

export function getInitials(firstName: string, lastName?: string): string {
  const initials = firstName.charAt(0).toUpperCase()
  if (lastName) {
    return initials + lastName.charAt(0).toUpperCase()
  }
  return initials
}

export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

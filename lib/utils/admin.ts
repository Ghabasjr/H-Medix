export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date)
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

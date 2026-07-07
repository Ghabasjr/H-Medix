// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  CUSTOMER: 'customer',
} as const

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Role labels
export const ROLE_LABELS: Record<UserRoleType, string> = {
  admin: 'Administrator',
  cashier: 'Cashier',
  customer: 'Customer',
}

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// API routes
export const API_ROUTES = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',

  // Users
  GET_USER: '/api/users',
  UPDATE_USER: '/api/users',
  DELETE_USER: '/api/users',

  // Transactions
  GET_TRANSACTIONS: '/api/transactions',
  CREATE_TRANSACTION: '/api/transactions',

  // Payments
  CREATE_PAYMENT: '/api/payments',
  GET_PAYMENT: '/api/payments',

  // QR Payments
  GENERATE_QR: '/api/qr-payments/generate',
  GET_QR: '/api/qr-payments',
} as const

// Navigation routes
export const ROUTES = {
  // Public routes
  ROOT: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  AUTH_ERROR: '/auth/error',

  // Protected routes
  DASHBOARD: '/dashboard',
  DASHBOARD_ADMIN: '/dashboard/admin',
  DASHBOARD_CASHIER: '/dashboard/cashier',
  DASHBOARD_CUSTOMER: '/dashboard/customer',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  TRANSACTIONS: '/dashboard/transactions',
  REPORTS: '/dashboard/reports',
} as const

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_GOOGLE_AUTH: true,
  ENABLE_EMAIL_VERIFICATION: false,
  ENABLE_TWO_FACTOR_AUTH: false,
  MAINTENANCE_MODE: false,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'HH:mm:ss',
  DATETIME: 'MMM dd, yyyy HH:mm:ss',
} as const

// Currency
export const CURRENCY = {
  CODE: 'NGN',
  SYMBOL: '₦',
  DECIMAL_PLACES: 2,
} as const

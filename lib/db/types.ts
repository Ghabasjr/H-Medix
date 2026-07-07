// Shared types for Firestore documents
export interface FirestoreTimestamp {
  seconds: number
  nanoseconds: number
}

export interface BaseDocument {
  id: string
  createdAt: FirestoreTimestamp | Date
  updatedAt: FirestoreTimestamp | Date
  createdBy?: string
}

export type UserRole = 'admin' | 'cashier' | 'customer'
export type UserStatus = 'active' | 'suspended' | 'deleted'
export type CashierStatus = 'active' | 'inactive' | 'terminated'
export type StoreStatus = 'active' | 'inactive' | 'suspended'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'qr_code' | 'card' | 'cash' | 'wallet'
export type PaymentStatus = 'initiated' | 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded'
export type QRPaymentStatus = 'active' | 'expired' | 'used' | 'cancelled'
export type NotificationType = 'payment_success' | 'payment_failed' | 'receipt' | 'alert' | 'system'
export type SettingType = 'string' | 'number' | 'boolean' | 'json'
export type AuditActionStatus = 'success' | 'failed'
export type SentVia = 'sms' | 'email' | 'in_app'

// Generic service response type
export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

// Generic query options
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

// Generic filter options
export interface FilterOptions {
  field: string
  operator: '==' | '<' | '<=' | '>' | '>=' | '!=' | 'in' | 'array-contains'
  value: any
}

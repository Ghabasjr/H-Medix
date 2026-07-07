import { collection, CollectionReference, DocumentData } from 'firebase/firestore'
import { db } from './config'

// Generic type-safe collection reference creator
function getCollection<T = DocumentData>(name: string): CollectionReference<T> {
  return collection(db, name) as CollectionReference<T>
}

// Collection references
export const usersCollection = getCollection('users')
export const storesCollection = getCollection('stores')
export const customersCollection = getCollection('customers')
export const cashiersCollection = getCollection('cashiers')
export const transactionsCollection = getCollection('transactions')
export const paymentsCollection = getCollection('payments')
export const qrPaymentsCollection = getCollection('qrPayments')
export const receiptsCollection = getCollection('receipts')
export const notificationsCollection = getCollection('notifications')
export const settingsCollection = getCollection('settings')
export const reportsCollection = getCollection('reports')
export const auditLogsCollection = getCollection('auditLogs')

// Export collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  STORES: 'stores',
  CUSTOMERS: 'customers',
  CASHIERS: 'cashiers',
  TRANSACTIONS: 'transactions',
  PAYMENTS: 'payments',
  QR_PAYMENTS: 'qrPayments',
  RECEIPTS: 'receipts',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  REPORTS: 'reports',
  AUDIT_LOGS: 'auditLogs',
} as const

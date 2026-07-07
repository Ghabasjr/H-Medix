import { BaseDocument, TransactionStatus, PaymentMethod } from '../types'

export interface TransactionItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface Transaction extends BaseDocument {
  storeId: string
  cashierId: string
  customerId: string
  amount: number
  currency: string
  status: TransactionStatus
  paymentMethod: PaymentMethod
  description?: string
  items: TransactionItem[]
  discount: number
  tax: number
  total: number
  paymentId?: string
  receiptId?: string
  completedAt?: Date | FirebaseFirestore.Timestamp
}

export interface CreateTransactionInput {
  storeId: string
  cashierId: string
  customerId: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  description?: string
  items: TransactionItem[]
  discount?: number
  tax?: number
  total: number
}

export interface UpdateTransactionInput {
  status?: TransactionStatus
  paymentId?: string
  receiptId?: string
  completedAt?: Date
}

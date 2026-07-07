import { BaseDocument } from '../types'
import { TransactionItem } from './transaction.types'

export interface Receipt extends BaseDocument {
  transactionId: string
  storeId: string
  customerId: string
  receiptNumber: string
  items: TransactionItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  receiptUrl?: string
  printedAt?: Date | FirebaseFirestore.Timestamp
  sentViaSMS: boolean
  sentViaEmail: boolean
}

export interface CreateReceiptInput {
  transactionId: string
  storeId: string
  customerId: string
  receiptNumber: string
  items: TransactionItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
}

export interface UpdateReceiptInput {
  receiptUrl?: string
  printedAt?: Date
  sentViaSMS?: boolean
  sentViaEmail?: boolean
}

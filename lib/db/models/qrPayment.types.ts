import { BaseDocument, QRPaymentStatus } from '../types'

export interface QRPayment extends BaseDocument {
  storeId: string
  cashierId: string
  qrCode: string
  qrImage: string
  amount: number
  currency: string
  status: QRPaymentStatus
  validUntil: Date | FirebaseFirestore.Timestamp
  transactionId?: string
  metadata: Record<string, any>
  usedAt?: Date | FirebaseFirestore.Timestamp
}

export interface CreateQRPaymentInput {
  storeId: string
  cashierId: string
  amount: number
  currency: string
  validUntil: Date
  metadata?: Record<string, any>
}

export interface UpdateQRPaymentInput {
  status?: QRPaymentStatus
  transactionId?: string
  usedAt?: Date
}

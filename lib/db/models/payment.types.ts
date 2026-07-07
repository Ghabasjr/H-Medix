import { BaseDocument, PaymentStatus } from '../types'

export interface Payment extends BaseDocument {
  transactionId: string
  storeId: string
  customerId: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentGateway: string
  gatewayReference: string
  authorizationCode?: string
  errorCode?: string
  errorMessage?: string
  metadata: Record<string, any>
  authorizedAt?: Date | FirebaseFirestore.Timestamp
  capturedAt?: Date | FirebaseFirestore.Timestamp
}

export interface CreatePaymentInput {
  transactionId: string
  storeId: string
  customerId: string
  amount: number
  currency: string
  paymentGateway: string
  metadata?: Record<string, any>
}

export interface UpdatePaymentInput {
  status?: PaymentStatus
  gatewayReference?: string
  authorizationCode?: string
  errorCode?: string
  errorMessage?: string
  authorizedAt?: Date
  capturedAt?: Date
}

import { db } from '@/lib/firebase/config'
import { doc, getDoc, setDoc, updateDoc, writeBatch, serverTimestamp, FieldValue } from 'firebase/firestore'
import { QRPayment } from '@/lib/db/models/qrPayment.types'
import { Transaction } from '@/lib/db/models/transaction.types'
import { PaymentMethod } from '@/lib/db/types'

interface ProcessPaymentInput {
  qrId: string
  customerId: string
  customerEmail?: string
  customerPhone?: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
}

interface ProcessPaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
}

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'object' && 'toDate' in value) {
    const timestamp = value as { toDate?: () => Date }
    if (typeof timestamp.toDate === 'function') return timestamp.toDate()
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  return null
}

function addIfDefined(
  target: Record<string, unknown>,
  key: string,
  value: unknown
) {
  if (value !== undefined) {
    target[key] = value
  }
}

/**
 * Process a payment from a QR code with atomic transaction safety
 * Prevents duplicate payments and ensures data consistency
 */
export async function processPayment(
  input: ProcessPaymentInput
): Promise<ProcessPaymentResponse> {
  try {
    const qrId = input.qrId
    const qrRef = doc(db, 'qrPayments', qrId)

    // Get QR payment details with atomicity check
    const qrSnap = await getDoc(qrRef)

    if (!qrSnap.exists()) {
      return { success: false, error: 'QR payment not found' }
    }

    const qrData = qrSnap.data() as QRPayment

    // Validate QR code status and expiration
    if (qrData.status === 'used') {
      return { success: false, error: 'This payment has already been processed' }
    }

    const validUntil = toDate(qrData.validUntil ?? (qrData as QRPayment & { expiresAt?: unknown }).expiresAt)
    if (!validUntil) {
      return { success: false, error: 'This payment has an invalid expiry date' }
    }

    if (validUntil < new Date()) {
      return { success: false, error: 'This QR code has expired' }
    }

    // Check if duplicate transaction already exists (same customer, same QR, same amount)
    const existingTx = await getDoc(
      doc(db, 'transactions', `${qrId}_${input.customerId}`)
    )

    if (existingTx.exists() && existingTx.data().status === 'completed') {
      return {
        success: false,
        error: 'Duplicate payment detected. This payment was already processed.',
        transactionId: existingTx.id
      }
    }

    // Check customer wallet balance
    const customerRef = doc(db, 'customers', input.customerId)
    const customerSnap = await getDoc(customerRef)

    const currentBalance = customerSnap.exists() ? (customerSnap.data().walletBalance || 0) : 0

    if (currentBalance < input.amount) {
      return {
        success: false,
        error: `Insufficient funds. Wallet balance: ₦${currentBalance.toLocaleString()}, Required: ₦${input.amount.toLocaleString()}`
      }
    }

    // Create transaction using batch to ensure atomicity
    const batch = writeBatch(db)
    const transactionId = `${qrId}_${input.customerId}_${Date.now()}`
    const txRef = doc(db, 'transactions', transactionId)

    // Create transaction document
    const transaction: Omit<Transaction, 'id'> = {
      customerId: input.customerId,
      storeId: qrData.storeId,
      cashierId: qrData.cashierId,
      amount: input.amount,
      currency: input.currency,
      paymentMethod: input.paymentMethod,
      status: 'completed',
      items: [],
      discount: 0,
      tax: 0,
      total: input.amount,
      paymentId: qrId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: input.customerId,
    }

    batch.set(txRef, transaction)

    // Update QR payment to 'used' status
    batch.update(qrRef, {
      status: 'used',
      usedAt: new Date(),
      usedByCustomerId: input.customerId,
      updatedAt: new Date(),
    })

    // Update or create customer document with wallet deduction
    if (customerSnap.exists()) {
      const newWalletBalance = (customerSnap.data().walletBalance || 0) - input.amount
      batch.update(customerRef, {
        walletBalance: newWalletBalance,
        totalSpent: (customerSnap.data().totalSpent || 0) + input.amount,
        transactionCount: (customerSnap.data().transactionCount || 0) + 1,
        lastTransactionAt: new Date(),
        updatedAt: new Date(),
      })
    } else {
      const customerData: Record<string, unknown> = {
        id: input.customerId,
        walletBalance: 0 - input.amount,
        totalSpent: input.amount,
        transactionCount: 1,
        status: 'active',
        lastTransactionAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      addIfDefined(customerData, 'email', input.customerEmail)
      addIfDefined(customerData, 'phone', input.customerPhone)

      batch.set(customerRef, customerData)
    }

    // Commit batch
    await batch.commit()

    // Create receipt document asynchronously (non-blocking)
    const receiptRef = doc(db, 'receipts', transactionId)
    setDoc(receiptRef, {
      id: transactionId,
      transactionId,
      qrPaymentId: qrId,
      customerId: input.customerId,
      storeId: qrData.storeId,
      cashierId: qrData.cashierId,
      amount: input.amount,
      currency: input.currency,
      paymentMethod: input.paymentMethod,
      status: 'generated',
      createdAt: new Date(),
    }).catch((err) => {
      console.error('Error creating receipt:', err)
    })

    // Create notification for cashier (non-blocking)
    const notificationRef = doc(db, 'notifications', `${transactionId}_cashier`)
    setDoc(notificationRef, {
      id: `${transactionId}_cashier`,
      userId: qrData.cashierId,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of ${input.currency} ${input.amount} received from QR ${qrId}`,
      relatedId: transactionId,
      status: 'unread',
      createdAt: new Date(),
    }).catch((err) => {
      console.error('Error creating notification:', err)
    })

    return { success: true, transactionId }
  } catch (error) {
    console.error('Payment processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment'
    }
  }
}

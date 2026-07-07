'use client'

import { FirestoreService } from './firestoreService'
import { Payment, CreatePaymentInput, UpdatePaymentInput } from '../models/payment.types'
import { ServiceResponse, QueryOptions } from '../types'

const COLLECTION_NAME = 'payments'

class PaymentService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getPaymentById(id: string): Promise<ServiceResponse<Payment>> {
    return this.service.getById<Payment>(id)
  }

  async getPaymentsByStore(
    storeId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<Payment[]>> {
    return this.service.getAll<Payment>(
      [{ field: 'storeId', operator: '==', value: storeId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getPaymentsByCustomer(customerId: string): Promise<ServiceResponse<Payment[]>> {
    return this.service.getAll<Payment>([
      { field: 'customerId', operator: '==', value: customerId },
    ])
  }

  async getPaymentsByStatus(
    storeId: string,
    status: string
  ): Promise<ServiceResponse<Payment[]>> {
    return this.service.getAll<Payment>([
      { field: 'storeId', operator: '==', value: storeId },
      { field: 'status', operator: '==', value: status },
    ])
  }

  async createPayment(input: CreatePaymentInput): Promise<ServiceResponse<Payment & { id: string }>> {
    const paymentData: Payment = {
      id: '',
      transactionId: input.transactionId,
      storeId: input.storeId,
      customerId: input.customerId,
      amount: input.amount,
      currency: input.currency,
      status: 'initiated',
      paymentGateway: input.paymentGateway,
      gatewayReference: '',
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Payment>(paymentData)
  }

  async updatePayment(id: string, input: UpdatePaymentInput): Promise<ServiceResponse<void>> {
    return this.service.update<Payment>(id, input)
  }

  async authorizePayment(
    id: string,
    authorizationCode: string,
    gatewayReference: string
  ): Promise<ServiceResponse<void>> {
    return this.service.update<Payment>(id, {
      status: 'authorized',
      authorizationCode,
      gatewayReference,
      authorizedAt: new Date(),
    })
  }

  async capturePayment(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Payment>(id, {
      status: 'captured',
      capturedAt: new Date(),
    })
  }

  async failPayment(id: string, errorCode: string, errorMessage: string): Promise<ServiceResponse<void>> {
    return this.service.update<Payment>(id, {
      status: 'failed',
      errorCode,
      errorMessage,
    })
  }

  async refundPayment(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Payment>(id, {
      status: 'refunded',
    })
  }

  async deletePayment(id: string): Promise<ServiceResponse<void>> {
    return this.service.softDelete(id)
  }
}

export const paymentService = new PaymentService()

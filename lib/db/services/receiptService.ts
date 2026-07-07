'use client'

import { FirestoreService } from './firestoreService'
import { Receipt, CreateReceiptInput, UpdateReceiptInput } from '../models/receipt.types'
import { ServiceResponse } from '../types'

const COLLECTION_NAME = 'receipts'

class ReceiptService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getReceiptById(id: string): Promise<ServiceResponse<Receipt>> {
    return this.service.getById<Receipt>(id)
  }

  async getReceiptByNumber(receiptNumber: string): Promise<ServiceResponse<Receipt | null>> {
    const response = await this.service.getAll<Receipt>([
      { field: 'receiptNumber', operator: '==', value: receiptNumber },
    ])

    if (!response.success || !response.data || response.data.length === 0) {
      return { success: true, data: null }
    }

    return { success: true, data: response.data[0] }
  }

  async getReceiptsByStore(storeId: string): Promise<ServiceResponse<Receipt[]>> {
    return this.service.getAll<Receipt>([
      { field: 'storeId', operator: '==', value: storeId },
    ])
  }

  async getReceiptsByCustomer(customerId: string): Promise<ServiceResponse<Receipt[]>> {
    return this.service.getAll<Receipt>([
      { field: 'customerId', operator: '==', value: customerId },
    ])
  }

  async getReceiptsByTransaction(transactionId: string): Promise<ServiceResponse<Receipt | null>> {
    const response = await this.service.getAll<Receipt>([
      { field: 'transactionId', operator: '==', value: transactionId },
    ])

    if (!response.success || !response.data || response.data.length === 0) {
      return { success: true, data: null }
    }

    return { success: true, data: response.data[0] }
  }

  async createReceipt(input: CreateReceiptInput): Promise<ServiceResponse<Receipt & { id: string }>> {
    const receiptData: Receipt = {
      id: '',
      transactionId: input.transactionId,
      storeId: input.storeId,
      customerId: input.customerId,
      receiptNumber: input.receiptNumber,
      items: input.items,
      subtotal: input.subtotal,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
      paymentMethod: input.paymentMethod,
      sentViaSMS: false,
      sentViaEmail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Receipt>(receiptData)
  }

  async updateReceipt(id: string, input: UpdateReceiptInput): Promise<ServiceResponse<void>> {
    return this.service.update<Receipt>(id, input)
  }

  async markAsPrinted(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Receipt>(id, {
      printedAt: new Date(),
    })
  }

  async markAsSentViaSMS(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Receipt>(id, {
      sentViaSMS: true,
    })
  }

  async markAsSentViaEmail(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Receipt>(id, {
      sentViaEmail: true,
    })
  }

  async deleteReceipt(id: string): Promise<ServiceResponse<void>> {
    return this.service.softDelete(id)
  }
}

export const receiptService = new ReceiptService()

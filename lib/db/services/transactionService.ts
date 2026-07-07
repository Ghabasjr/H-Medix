'use client'

import { FirestoreService } from './firestoreService'
import { Transaction, CreateTransactionInput, UpdateTransactionInput } from '../models/transaction.types'
import { ServiceResponse, QueryOptions } from '../types'

const COLLECTION_NAME = 'transactions'

class TransactionService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getTransactionById(id: string): Promise<ServiceResponse<Transaction>> {
    return this.service.getById<Transaction>(id)
  }

  async getAllTransactions(options?: QueryOptions): Promise<ServiceResponse<Transaction[]>> {
    return this.service.getAll<Transaction>(
      [],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getTransactionsByStore(
    storeId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<Transaction[]>> {
    return this.service.getAll<Transaction>(
      [{ field: 'storeId', operator: '==', value: storeId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getTransactionsByCustomer(
    customerId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<Transaction[]>> {
    return this.service.getAll<Transaction>(
      [{ field: 'customerId', operator: '==', value: customerId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getTransactionsByCashier(
    cashierId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<Transaction[]>> {
    return this.service.getAll<Transaction>(
      [{ field: 'cashierId', operator: '==', value: cashierId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getTransactionsByStatus(
    storeId: string,
    status: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<Transaction[]>> {
    return this.service.getAll<Transaction>(
      [
        { field: 'storeId', operator: '==', value: storeId },
        { field: 'status', operator: '==', value: status },
      ],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async createTransaction(input: CreateTransactionInput): Promise<ServiceResponse<Transaction & { id: string }>> {
    const transactionData: Transaction = {
      id: '',
      storeId: input.storeId,
      cashierId: input.cashierId,
      customerId: input.customerId,
      amount: input.amount,
      currency: input.currency,
      status: 'pending',
      paymentMethod: input.paymentMethod,
      description: input.description,
      items: input.items,
      discount: input.discount ?? 0,
      tax: input.tax ?? 0,
      total: input.total,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Transaction>(transactionData)
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<ServiceResponse<void>> {
    return this.service.update<Transaction>(id, input)
  }

  async completeTransaction(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Transaction>(id, {
      status: 'completed',
      completedAt: new Date(),
    })
  }

  async failTransaction(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Transaction>(id, {
      status: 'failed',
    })
  }

  async deleteTransaction(id: string): Promise<ServiceResponse<void>> {
    return this.service.softDelete(id)
  }
}

export const transactionService = new TransactionService()

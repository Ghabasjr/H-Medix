'use client'

import { FirestoreService } from './firestoreService'
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../models/customer.types'
import { ServiceResponse } from '../types'

const COLLECTION_NAME = 'customers'

class CustomerService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getCustomerById(id: string): Promise<ServiceResponse<Customer>> {
    return this.service.getById<Customer>(id)
  }

  async getCustomerByUid(uid: string): Promise<ServiceResponse<Customer | null>> {
    const response = await this.service.getAll<Customer>([
      { field: 'uid', operator: '==', value: uid },
    ])

    if (!response.success || !response.data || response.data.length === 0) {
      return { success: true, data: null }
    }

    return { success: true, data: response.data[0] }
  }

  async getAllCustomers(): Promise<ServiceResponse<Customer[]>> {
    return this.service.getAll<Customer>()
  }

  async createCustomer(input: CreateCustomerInput): Promise<ServiceResponse<Customer & { id: string }>> {
    const customerData: Customer = {
      id: '',
      uid: input.uid,
      phone: input.phone,
      address: input.address,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      country: input.country,
      totalSpent: 0,
      transactionCount: 0,
      walletBalance: input.walletBalance || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Customer>(customerData)
  }

  async updateCustomer(id: string, input: UpdateCustomerInput): Promise<ServiceResponse<void>> {
    return this.service.update<Customer>(id, input)
  }

  async incrementTotalSpent(id: string, amount: number): Promise<ServiceResponse<void>> {
    const customer = await this.getCustomerById(id)
    if (!customer.success || !customer.data) {
      return { success: false, error: 'Customer not found' }
    }

    return this.service.update<Customer>(id, {
      totalSpent: customer.data.totalSpent + amount,
      transactionCount: customer.data.transactionCount + 1,
    })
  }

  async deleteCustomer(id: string): Promise<ServiceResponse<void>> {
    return this.service.softDelete(id)
  }

  async topUpWallet(customerId: string, amount: number): Promise<ServiceResponse<void>> {
    const customer = await this.getCustomerById(customerId)
    if (!customer.success || !customer.data) {
      return { success: false, error: 'Customer not found' }
    }

    const newBalance = (customer.data.walletBalance || 0) + amount
    return this.service.update<Customer>(customerId, {
      walletBalance: newBalance,
    })
  }

  async deductFromWallet(customerId: string, amount: number): Promise<ServiceResponse<{ success: boolean; newBalance?: number; error?: string }>> {
    const customer = await this.getCustomerById(customerId)
    if (!customer.success || !customer.data) {
      return { success: false, data: { success: false, error: 'Customer not found' } }
    }

    const currentBalance = customer.data.walletBalance || 0

    if (currentBalance < amount) {
      return {
        success: true,
        data: {
          success: false,
          error: `Insufficient funds. Wallet balance: ₦${currentBalance}, Required: ₦${amount}`
        }
      }
    }

    const newBalance = currentBalance - amount
    const updateResult = await this.service.update<Customer>(customerId, {
      walletBalance: newBalance,
      totalSpent: customer.data.totalSpent + amount,
      transactionCount: customer.data.transactionCount + 1,
    })

    if (updateResult.success) {
      return { success: true, data: { success: true, newBalance } }
    }

    return { success: false, data: { success: false, error: 'Failed to deduct from wallet' } }
  }

  async getWalletBalance(customerId: string): Promise<ServiceResponse<number>> {
    const customer = await this.getCustomerById(customerId)
    if (!customer.success || !customer.data) {
      return { success: false, error: 'Customer not found' }
    }

    return { success: true, data: customer.data.walletBalance || 0 }
  }

  export const customerService = new CustomerService()

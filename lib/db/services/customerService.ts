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
}

export const customerService = new CustomerService()

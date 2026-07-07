import { BaseDocument } from '../types'

export interface Customer extends BaseDocument {
  uid: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  totalSpent: number
  transactionCount: number
}

export interface CreateCustomerInput {
  uid: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface UpdateCustomerInput {
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

import { BaseDocument } from '../types'

export interface Customer extends BaseDocument {
  uid: string
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  totalSpent: number
  transactionCount: number
  walletBalance: number
  status?: string
  lastTransactionAt?: Date
}

export interface CreateCustomerInput {
  uid: string
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  walletBalance?: number
}

export interface UpdateCustomerInput {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  walletBalance?: number
  status?: string
  lastTransactionAt?: Date
}

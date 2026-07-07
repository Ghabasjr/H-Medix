import { BaseDocument, StoreStatus } from '../types'

export interface Store extends BaseDocument {
  name: string
  description?: string
  ownerId: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  logo?: string
  currency: string
  timezone: string
  status: StoreStatus
}

export interface CreateStoreInput {
  name: string
  description?: string
  ownerId: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  logo?: string
  currency: string
  timezone: string
}

export interface UpdateStoreInput {
  name?: string
  description?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  phone?: string
  email?: string
  logo?: string
  currency?: string
  timezone?: string
  status?: StoreStatus
}

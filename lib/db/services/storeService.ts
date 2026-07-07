'use client'

import { FirestoreService } from './firestoreService'
import { Store, CreateStoreInput, UpdateStoreInput } from '../models/store.types'
import { ServiceResponse } from '../types'

const COLLECTION_NAME = 'stores'

class StoreService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getStoreById(id: string): Promise<ServiceResponse<Store>> {
    return this.service.getById<Store>(id)
  }

  async getAllStores(): Promise<ServiceResponse<Store[]>> {
    return this.service.getAll<Store>()
  }

  async getStoresByOwner(ownerId: string): Promise<ServiceResponse<Store[]>> {
    return this.service.getAll<Store>([
      { field: 'ownerId', operator: '==', value: ownerId },
    ])
  }

  async getActiveStores(): Promise<ServiceResponse<Store[]>> {
    return this.service.getAll<Store>([
      { field: 'status', operator: '==', value: 'active' },
    ])
  }

  async createStore(input: CreateStoreInput): Promise<ServiceResponse<Store & { id: string }>> {
    const storeData: Store = {
      id: '',
      name: input.name,
      description: input.description,
      ownerId: input.ownerId,
      address: input.address,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      country: input.country,
      phone: input.phone,
      email: input.email,
      logo: input.logo,
      currency: input.currency,
      timezone: input.timezone,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Store>(storeData)
  }

  async updateStore(id: string, input: UpdateStoreInput): Promise<ServiceResponse<void>> {
    return this.service.update<Store>(id, input)
  }

  async deleteStore(id: string): Promise<ServiceResponse<void>> {
    return this.service.softDelete(id)
  }
}

export const storeService = new StoreService()

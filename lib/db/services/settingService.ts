'use client'

import { FirestoreService } from './firestoreService'
import { Setting, CreateSettingInput, UpdateSettingInput } from '../models/setting.types'
import { ServiceResponse } from '../types'

const COLLECTION_NAME = 'settings'

class SettingService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getSettingById(id: string): Promise<ServiceResponse<Setting>> {
    return this.service.getById<Setting>(id)
  }

  async getStoreSetting(storeId: string, key: string): Promise<ServiceResponse<Setting | null>> {
    const response = await this.service.getAll<Setting>([
      { field: 'storeId', operator: '==', value: storeId },
      { field: 'key', operator: '==', value: key },
    ])

    if (!response.success || !response.data || response.data.length === 0) {
      return { success: true, data: null }
    }

    return { success: true, data: response.data[0] }
  }

  async getUserSetting(userId: string, key: string): Promise<ServiceResponse<Setting | null>> {
    const response = await this.service.getAll<Setting>([
      { field: 'userId', operator: '==', value: userId },
      { field: 'key', operator: '==', value: key },
    ])

    if (!response.success || !response.data || response.data.length === 0) {
      return { success: true, data: null }
    }

    return { success: true, data: response.data[0] }
  }

  async getStoreSettings(storeId: string): Promise<ServiceResponse<Setting[]>> {
    return this.service.getAll<Setting>([
      { field: 'storeId', operator: '==', value: storeId },
    ])
  }

  async getUserSettings(userId: string): Promise<ServiceResponse<Setting[]>> {
    return this.service.getAll<Setting>([
      { field: 'userId', operator: '==', value: userId },
    ])
  }

  async createSetting(input: CreateSettingInput): Promise<ServiceResponse<Setting & { id: string }>> {
    const settingData: Setting = {
      id: '',
      storeId: input.storeId,
      userId: input.userId,
      key: input.key,
      value: input.value,
      type: input.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Setting>(settingData)
  }

  async updateSetting(id: string, input: UpdateSettingInput): Promise<ServiceResponse<void>> {
    return this.service.update<Setting>(id, input)
  }

  async deleteSetting(id: string): Promise<ServiceResponse<void>> {
    return this.service.hardDelete(id)
  }
}

export const settingService = new SettingService()

import { BaseDocument, SettingType } from '../types'

export interface Setting extends BaseDocument {
  storeId?: string
  userId?: string
  key: string
  value: any
  type: SettingType
}

export interface CreateSettingInput {
  storeId?: string
  userId?: string
  key: string
  value: any
  type: SettingType
}

export interface UpdateSettingInput {
  value: any
}

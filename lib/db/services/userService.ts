'use client'

import { FirestoreService } from './firestoreService'
import { User, CreateUserInput, UpdateUserInput } from '../models/user.types'
import { ServiceResponse } from '../types'

const COLLECTION_NAME = 'users'

class UserService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getUserById(id: string): Promise<ServiceResponse<User>> {
    return this.service.getById<User>(id)
  }

  async getUserByEmail(email: string): Promise<ServiceResponse<User | null>> {
    const response = await this.service.getAll<User>([
      { field: 'email', operator: '==', value: email },
    ])

    if (!response.success || !response.data || response.data.length === 0) {
      return { success: true, data: null }
    }

    return { success: true, data: response.data[0] }
  }

  async getAllUsers(): Promise<ServiceResponse<User[]>> {
    return this.service.getAll<User>()
  }

  async getUsersByRole(role: string): Promise<ServiceResponse<User[]>> {
    return this.service.getAll<User>([{ field: 'role', operator: '==', value: role }])
  }

  async createUser(input: CreateUserInput): Promise<ServiceResponse<User & { id: string }>> {
    const userData: User = {
      id: '',
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      role: input.role,
      emailVerified: input.emailVerified ?? false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<User>(userData)
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<ServiceResponse<void>> {
    return this.service.update<User>(id, input)
  }

  async updateUserLastLogin(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<User>(id, { lastLogin: new Date() })
  }

  async deleteUser(id: string): Promise<ServiceResponse<void>> {
    return this.service.softDelete(id)
  }
}

export const userService = new UserService()

import { BaseDocument, UserRole, UserStatus } from '../types'

export interface User extends BaseDocument {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  emailVerified: boolean
  lastLogin?: Date | FirebaseFirestore.Timestamp
  status: UserStatus
}

export interface CreateUserInput {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  emailVerified?: boolean
}

export interface UpdateUserInput {
  displayName?: string
  photoURL?: string
  role?: UserRole
  status?: UserStatus
}

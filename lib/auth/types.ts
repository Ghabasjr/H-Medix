export type UserRole = 'admin' | 'cashier' | 'customer'

export interface User {
  uid: string
  id?: string
  email: string
  displayName: string | null
  name?: string | null
  photoURL: string | null
  role: UserRole
  storeId?: string | null
  createdAt: number
  updatedAt: number
  emailVerified: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signUpWithEmail: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  loginWithGoogle: (idToken: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export interface AuthError {
  code: string
  message: string
}

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { User, AuthContextType, UserRole } from '@/lib/auth/types'
import * as authService from '@/lib/auth/service'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state listener
  useEffect(() => {
    if (!auth) {
      // auth is null (e.g. SSR), resolve loading immediately
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    // Properly return cleanup so React can unsubscribe when unmounted
    return () => unsubscribe()
  }, [])

  const signUpWithEmail = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      setError(null)
      const newUser = await authService.signUpWithEmail(email, password, displayName, role)
      setUser(newUser)
    } catch (err: any) {
      const errorMessage = authService.getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setError(null)
      const loggedInUser = await authService.loginWithEmail(email, password)
      setUser(loggedInUser)
    } catch (err: any) {
      const errorMessage = authService.getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const loginWithGoogle = async (idToken: string, role: UserRole) => {
    try {
      setError(null)
      const googleUser = await authService.loginWithGoogle(idToken, role)
      setUser(googleUser)
    } catch (err: any) {
      const errorMessage = authService.getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await authService.logout()
      setUser(null)
    } catch (err: any) {
      const errorMessage = authService.getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUpWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

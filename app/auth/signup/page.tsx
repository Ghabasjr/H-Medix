'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES, USER_ROLES } from '@/lib/constants/app'
import { UserRole } from '@/lib/auth/types'
import { isValidEmail, validatePassword, isValidDisplayName } from '@/lib/utils/validation'

export default function SignupPage() {
  const router = useRouter()
  const { signUpWithEmail } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.displayName) {
      newErrors.displayName = 'Name is required'
    } else if (!isValidDisplayName(formData.displayName)) {
      newErrors.displayName = 'Name must be between 2 and 50 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const validation = validatePassword(formData.password)
      if (!validation.isValid) {
        newErrors.password = validation.errors[0]
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await signUpWithEmail(formData.email, formData.password, formData.displayName, formData.role)
      addToast('Account created successfully! Please log in.', 'success')
      router.push(ROUTES.LOGIN)
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Signup failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join our QR Cashless Payment System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={handleChange}
                error={!!errors.displayName}
                disabled={loading}
              />
              {errors.displayName && <p className="text-xs text-destructive">{errors.displayName}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Account Type
              </label>
              <Select name="role" value={formData.role} onChange={handleChange} disabled={loading}>
                <option value={USER_ROLES.CUSTOMER}>Customer</option>
                <option value={USER_ROLES.CASHIER}>Cashier</option>
                <option value={USER_ROLES.ADMIN}>Administrator</option>
              </Select>
              {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                disabled={loading}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">
                At least 6 characters, including uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                disabled={loading}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Spinner size="sm" className="mr-2" />}
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

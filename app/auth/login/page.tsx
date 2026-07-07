'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/lib/constants/app'
import { isValidEmail } from '@/lib/utils/validation'

export default function LoginPage() {
  const router = useRouter()
  const { loginWithEmail } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      await loginWithEmail(formData.email, formData.password)
      addToast('Login successful!', 'success')
      router.push(ROUTES.DASHBOARD)
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Spinner size="sm" className="mr-2" />}
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {/* Signup Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href={ROUTES.SIGNUP} className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

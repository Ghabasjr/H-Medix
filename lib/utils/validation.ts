// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Display name validation
export function isValidDisplayName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50
}

// Currency validation
export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return !isNaN(num) && num > 0
}

// Phone number validation (basic)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phone.length >= 7 && phoneRegex.test(phone)
}

// Form validation helpers
export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!isValidEmail(email)) return 'Please enter a valid email address'
  return null
}

export function validatePasswordField(password: string): string | null {
  if (!password) return 'Password is required'
  const validation = validatePassword(password)
  if (!validation.isValid) {
    return validation.errors[0]
  }
  return null
}

export function validateDisplayName(name: string): string | null {
  if (!name) return 'Name is required'
  if (!isValidDisplayName(name)) return 'Name must be between 2 and 50 characters'
  return null
}

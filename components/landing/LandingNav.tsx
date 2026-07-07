'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/app'
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'

export function LandingNav() {
  const { isDark, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <span className="font-bold text-lg text-foreground">QR Pay</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition text-sm">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition text-sm">
              Pricing
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition text-sm">
              Docs
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition text-sm">
              Blog
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition"
              aria-label="Toggle theme"
            >
              {isDark ? '🌞' : '🌙'}
            </button>

            {/* Auth buttons - desktop */}
            <div className="hidden sm:flex gap-3">
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href={ROUTES.SIGNUP}>
                <Button size="sm" className="rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-border"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              href="#features"
              className="block text-muted-foreground hover:text-foreground transition text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block text-muted-foreground hover:text-foreground transition text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="block text-muted-foreground hover:text-foreground transition text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <div className="flex gap-2 pt-3">
              <Link href={ROUTES.LOGIN} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href={ROUTES.SIGNUP} className="flex-1">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

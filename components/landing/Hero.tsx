'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/app'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-linear-to-b from-background via-background to-secondary/30 pt-32 pb-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur">
            <span className="text-xs font-medium text-accent">✨ Launch your payments today</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
            QR Payments
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-foreground to-accent">
              Made Simple
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Secure, instant QR code transactions for every business. Accept payments, manage cashiers, and track transactions in real-time—all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href={ROUTES.SIGNUP}>
              <Button size="lg" className="h-12 px-8 text-base rounded-full font-semibold">
                Get Started
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base rounded-full font-semibold"
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-8 pt-12 border-t border-border mt-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">10K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">$500M+</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/app'

export function CTA() {
  return (
    <section className="py-20 bg-linear-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-12 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Ready to Transform Your Payments?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses that trust QR Payments. Start accepting secure QR-based payments today—no setup fees, instant settlements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href={ROUTES.SIGNUP}>
              <Button size="lg" className="h-12 px-8 text-base rounded-full font-semibold">
                Start Now
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base rounded-full font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* <p className="text-sm text-muted-foreground">
            14 days free. No credit card required. Full access to all features.
          </p> */}
        </div>
      </div>
    </section>
  )
}

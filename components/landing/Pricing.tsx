'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/app'

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses',
      price: '$29',
      period: 'per month',
      features: [
        'Up to 1,000 transactions/month',
        'Single cashier account',
        'Basic analytics',
        'Email support',
        'Standard security',
      ],
      cta: 'Start Free Trial',
      highlight: false,
    },
    {
      name: 'Professional',
      description: 'For growing businesses',
      price: '$99',
      period: 'per month',
      features: [
        'Up to 50,000 transactions/month',
        'Up to 10 cashiers',
        'Advanced analytics & reports',
        'Priority support',
        'API access',
        'Custom branding',
        'PCI compliance included',
      ],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Unlimited transactions',
        'Unlimited cashiers',
        'White-label solution',
        '24/7 dedicated support',
        'Advanced fraud detection',
        'Custom integrations',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      highlight: false,
    },
  ]

  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include free setup.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg border transition-all ${
                plan.highlight
                  ? 'border-accent bg-card ring-2 ring-accent/20 shadow-xl lg:scale-105'
                  : 'border-border bg-background hover:border-accent/30'
              }`}
            >
              {/* Badge for popular */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link href={ROUTES.SIGNUP} className="mb-8">
                  <Button
                    className="w-full rounded-full font-semibold"
                    variant={plan.highlight ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-4 flex-1 border-t border-border pt-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-accent mt-1">✓</span>
                      <p className="text-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans come with 14 days free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Check our <span className="text-accent cursor-pointer hover:underline">FAQ</span> or <span className="text-accent cursor-pointer hover:underline">contact us</span>
          </p>
        </div>
      </div>
    </section>
  )
}

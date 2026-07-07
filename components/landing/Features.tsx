'use client'

export function Features() {
  const features = [
    {
      title: 'Instant QR Payments',
      description: 'Generate unique QR codes for each transaction. Customers scan and pay instantly with complete security.',
      icon: '⚡',
    },
    {
      title: 'Real-time Analytics',
      description: 'Monitor transactions, sales trends, and business metrics on a powerful analytics dashboard.',
      icon: '📊',
    },
    {
      title: 'Cashier Management',
      description: 'Manage multiple cashiers, track their transactions, and maintain complete audit logs.',
      icon: '👥',
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, PCI compliance, and advanced fraud detection for your peace of mind.',
      icon: '🔒',
    },
    {
      title: 'Multi-role Platform',
      description: 'Separate dashboards for admins, cashiers, and customers with role-based access control.',
      icon: '🎯',
    },
    // {
    //   title: 'API Integration',
    //   description: 'Seamlessly integrate with your existing systems through our comprehensive REST API.',
    //   icon: '🔗',
    // },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Powerful Features for Modern Payments
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accept payments, manage transactions, and grow your business.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-lg border border-border bg-card hover:border-accent/50 transition-all hover:shadow-lg"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

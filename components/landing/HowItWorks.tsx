'use client'

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create your account in minutes. Choose your role: Admin, Cashier, or Customer.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      number: '2',
      title: 'Generate QR Codes',
      description: 'Create unique QR codes for each transaction. Display at checkout or send via SMS.',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      number: '3',
      title: 'Customers Pay',
      description: 'Customers scan the QR code with any smartphone and complete payment instantly.',
      color: 'bg-pink-100 text-pink-700',
    },
    {
      number: '4',
      title: 'Track & Manage',
      description: 'Monitor transactions in real-time on your dashboard. Access complete audit trails.',
      color: 'bg-green-100 text-green-700',
    },
  ]

  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get up and running in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-transparent translate-x-12" />
              )}

              {/* Card */}
              <div className="relative bg-background border border-border rounded-lg p-8 h-full">
                {/* Step number circle */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step.color}`}>
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-3 pr-8">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

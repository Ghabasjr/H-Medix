'use client'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Store Manager, Fashion Retail',
      image: '👩‍💼',
      quote: 'QR Payments has transformed how we handle transactions. Our customers love the simplicity, and our team can focus on service.',
      rating: 5,
    },
    {
      name: 'Ahmed Hassan',
      role: 'Cafe Owner',
      image: '👨‍💼',
      quote: 'The best part? Zero setup fees and instant settlements. The dashboard gives us complete visibility into our sales.',
      rating: 5,
    },
    {
      name: 'Maria Garcia',
      role: 'Payment Operations Lead',
      image: '👩‍💻',
      quote: 'Security and compliance are built-in. We can confidently process payments knowing everything is PCI compliant.',
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about QR Payments.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed italic">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 border-t border-border pt-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

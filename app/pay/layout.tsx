import type { ReactNode } from 'react'

export const metadata = {
  title: 'Complete Payment - QR Cashless System',
  description: 'Secure QR code payment portal',
}

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <div className="container max-w-md mx-auto py-12 px-4">
        {children}
      </div>
    </div>
  )
}

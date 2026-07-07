'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Wallet, History, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CustomerDashboard() {
  const router = useRouter()
  const [showScanner, setShowScanner] = useState(false)
  const [qrInput, setQrInput] = useState('')

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = qrInput.trim()
    if (!trimmed) return
    // Extract QR ID — supports raw ID or a full URL like /pay/[qrId]
    const match = trimmed.match(/pay\/([^?&/]+)/)
    const qrId = match ? match[1] : trimmed
    router.push(`/pay/${qrId}`)
  }

  return (
    <ProtectedRoute requiredRoles={['customer']}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pay Now</h1>
            <p className="text-muted-foreground mt-2">Scan QR codes or enter a payment ID</p>
          </div>
          <Button size="lg" onClick={() => setShowScanner(true)} className="gap-2">
            <QrCode className="h-5 w-5" />
            Scan QR Code
          </Button>
        </div>

        {/* QR Input Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm mx-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Enter Payment ID
                </CardTitle>
                <button
                  onClick={() => { setShowScanner(false); setQrInput('') }}
                  className="p-1 rounded hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleScanSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment ID or QR URL</label>
                    <Input
                      autoFocus
                      placeholder="PAY-... or paste QR link"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the Payment ID shown on the cashier&apos;s screen
                    </p>
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={!qrInput.trim()}>
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦0.00</div>
              <p className="text-xs text-muted-foreground">Coming in Phase 2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦0.00</div>
              <p className="text-xs text-muted-foreground">Coming in Phase 2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Coming in Phase 2</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Your payment history will appear here</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

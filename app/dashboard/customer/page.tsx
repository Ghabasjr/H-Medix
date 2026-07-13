'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Wallet, History, X, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { customerService } from '@/lib/db/services/customerService'
import { Customer } from '@/lib/db/models/customer.types'
import { formatCurrency } from '@/lib/utils/admin'
import { useToast } from '@/contexts/ToastContext'

type DetectedBarcode = { rawValue: string }
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>
}

export default function CustomerDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [showScanner, setShowScanner] = useState(false)
  const [qrInput, setQrInput] = useState('')
  const [scannerError, setScannerError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTopingUp, setIsTopingUp] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Fetch customer data on mount or when user changes
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const response = await customerService.getCustomerByUid(user.uid)
        if (response.success && response.data) {
          setCustomer(response.data)
          return
        }

        const createResponse = await customerService.createCustomer({
          uid: user.uid,
          name: user.name || user.displayName || '',
          email: user.email,
          walletBalance: 0,
        })

        if (createResponse.success && createResponse.data) {
          setCustomer(createResponse.data)
        } else {
          addToast(createResponse.error || 'Could not create customer wallet profile', 'error')
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
        addToast('Error loading customer wallet profile', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [addToast, user?.displayName, user?.email, user?.name, user?.uid])

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setScanning(false)
  }

  const openPayment = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    let qrId = trimmed

    try {
      const parsed = new URL(trimmed)
      if (parsed.protocol === 'qrpay:') {
        qrId = parsed.hostname || parsed.pathname.replace(/^\/+/, '')
      } else {
        const match = parsed.pathname.match(/\/pay\/([^/?#]+)/)
        qrId = match ? match[1] : trimmed
      }
    } catch {
      const match = trimmed.match(/(?:^|\/)pay\/([^?&#/]+)/)
      qrId = match ? match[1] : trimmed
    }

    stopScanner()
    setShowScanner(false)
    setQrInput('')
    router.push(`/pay/${encodeURIComponent(qrId)}`)
  }

  useEffect(() => {
    if (!showScanner) {
      stopScanner()
      return
    }

    let cancelled = false

    const startScanner = async () => {
      setScannerError('')

      const BarcodeDetector = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
      if (!BarcodeDetector) {
        setScannerError('Camera scanning is not supported in this browser. Use the payment ID or link below.')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        setScanning(true)
        const detector = new BarcodeDetector({ formats: ['qr_code'] })

        const scanFrame = async () => {
          if (cancelled || !videoRef.current) return

          try {
            const codes = await detector.detect(videoRef.current)
            const value = codes[0]?.rawValue
            if (value) {
              openPayment(value)
              return
            }
          } catch {
            setScannerError('Could not read the QR code yet. Hold the camera steady or use the backup field.')
          }

          window.setTimeout(scanFrame, 400)
        }

        scanFrame()
      } catch {
        setScannerError('Camera permission is required to scan. Use the payment ID or link below.')
      }
    }

    startScanner()

    return () => {
      cancelled = true
      stopScanner()
    }
  }, [showScanner])

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    openPayment(qrInput)
  }

  const closeScanner = () => {
    stopScanner()
    setShowScanner(false)
    setQrInput('')
    setScannerError('')
  }

  const closeTopUpModal = () => {
    if (isTopingUp) return
    setShowTopUpModal(false)
    setTopUpAmount('')
  }

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customer?.id) {
      addToast('Customer wallet profile not found', 'error')
      return
    }

    const amount = Number(topUpAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      addToast('Please enter a valid top-up amount', 'error')
      return
    }

    setIsTopingUp(true)
    try {
      const response = await customerService.topUpWallet(customer.id, amount)

      if (!response.success) {
        addToast(response.error || 'Failed to top up wallet', 'error')
        return
      }

      setCustomer((current) => current
        ? { ...current, walletBalance: (current.walletBalance || 0) + amount }
        : current
      )
      addToast(`${formatCurrency(amount)} added to your wallet`, 'success')
      setShowTopUpModal(false)
      setTopUpAmount('')
    } catch (error) {
      console.error('Customer top-up error:', error)
      addToast('Error adding funds to wallet', 'error')
    } finally {
      setIsTopingUp(false)
    }
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

        {showScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm mx-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Scan QR Code
                </CardTitle>
                <button onClick={closeScanner} className="p-1 rounded hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-lg border border-border bg-muted aspect-square">
                    <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
                  </div>
                  {scannerError ? (
                    <p className="text-xs text-destructive">{scannerError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {scanning
                        ? 'Point your camera at the cashier QR code to open the payment page.'
                        : 'Starting camera...'}
                    </p>
                  )}
                </div>
                <form onSubmit={handleScanSubmit} className="space-y-4">
                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium">Payment ID or QR URL</label>
                    <Input
                      placeholder="PAY-... or paste QR link"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Second option: enter the Payment ID or paste the payment link.
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

        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Top Up Wallet
                </CardTitle>
                <button
                  onClick={closeTopUpModal}
                  className="p-1 rounded hover:bg-muted"
                  disabled={isTopingUp}
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTopUpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="topUpAmount" className="text-sm font-medium">
                      Amount
                    </label>
                    <Input
                      id="topUpAmount"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter amount in NGN"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      disabled={isTopingUp}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                      Current balance: {formatCurrency(customer?.walletBalance || 0)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeTopUpModal}
                      disabled={isTopingUp}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isTopingUp || !topUpAmount.trim()}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {isTopingUp ? 'Adding...' : 'Add Funds'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : formatCurrency(customer?.walletBalance || 0)}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Wallet funds available</p>
                <Button
                  size="sm"
                  onClick={() => setShowTopUpModal(true)}
                  disabled={loading || isTopingUp || !customer}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Top Up
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : formatCurrency(customer?.totalSpent || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : customer?.transactionCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total transactions</p>
            </CardContent>
          </Card>
        </div>

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

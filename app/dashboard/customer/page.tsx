'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Wallet, History, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type DetectedBarcode = { rawValue: string }
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [showScanner, setShowScanner] = useState(false)
  const [qrInput, setQrInput] = useState('')
  const [scannerError, setScannerError] = useState('')
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NGN 0.00</div>
              <p className="text-xs text-muted-foreground">Coming in Phase 2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NGN 0.00</div>
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

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { X, Copy, Download } from 'lucide-react'
import { generateQRCodeDataURL, createPaymentQRData, downloadQRCode } from '@/lib/utils/qr/qrGenerator'
import { formatCurrency } from '@/lib/utils/admin'
import { useToast } from '@/contexts/ToastContext'
import { db } from '@/lib/firebase/config'
import { doc, setDoc } from 'firebase/firestore'

interface GeneratePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  storeId: string
  cashierId: string
  storeName: string
}

export function GeneratePaymentModal({
  isOpen,
  onClose,
  storeId,
  cashierId,
  storeName,
}: GeneratePaymentModalProps) {
  const { addToast } = useToast()
  const [amount, setAmount] = useState('')
  const [generating, setGenerating] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error')
      return
    }

    try {
      setGenerating(true)

      // Generate payment ID (in real app, would come from backend)
      const id = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create a normal web payment link so phone cameras open it directly.
      const qrData = createPaymentQRData(id, window.location.origin)

      // Generate QR code
      const qrUrl = await generateQRCodeDataURL(qrData)

      const now = new Date()
      const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      await setDoc(doc(db, 'qrPayments', id), {
        id,
        storeId,
        cashierId,
        qrCode: qrData,
        qrImage: qrUrl,
        amount: parseFloat(amount),
        currency: 'NGN',
        status: 'active',
        validUntil,
        metadata: {
          storeName,
          paymentId: id,
          paymentLink: qrData,
        },
        createdAt: now,
        updatedAt: now,
        createdBy: cashierId,
      })

      setPaymentId(id)
      setPaymentLink(qrData)
      setQrCodeUrl(qrUrl)

      addToast('QR code generated successfully', 'success')
    } catch (error) {
      console.error('QR generation error:', error)
      addToast('Failed to generate QR code', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!paymentLink && !paymentId) return

    try {
      await navigator.clipboard.writeText(paymentLink || paymentId || '')
      addToast('Payment link copied to clipboard', 'success')
    } catch (error) {
      addToast('Failed to copy to clipboard', 'error')
    }
  }

  const handleDownload = () => {
    if (!qrCodeUrl || !paymentId) return
    downloadQRCode(qrCodeUrl, `payment-${paymentId}.png`)
    addToast('QR code downloaded', 'success')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Generate Payment</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!qrCodeUrl ? (
            <>
              {/* Store Info */}
              <div className="bg-accent/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Store</p>
                <p className="font-semibold">{storeName}</p>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (₦)</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground font-semibold">
                    ₦
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={generating}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={generating || !amount}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  'Generate QR Code'
                )}
              </Button>
            </>
          ) : (
            <>
              {/* QR Code Display */}
              <div className="space-y-4">
                <div className="bg-accent/10 rounded-lg p-4 text-center">
                  <img
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-full max-w-xs mx-auto"
                  />
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Scan Link</p>
                    <p className="font-mono text-sm break-all">{paymentLink}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="font-mono text-sm break-all">{paymentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(parseFloat(amount))}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCopyToClipboard}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                {/* New Payment Button */}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQrCodeUrl(null)
                    setPaymentId(null)
                    setPaymentLink(null)
                    setAmount('')
                  }}
                  className="w-full"
                >
                  Generate Another
                </Button>
              </div>
            </>
          )}

          {/* Close Button */}
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}

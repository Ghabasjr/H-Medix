// QR Code generation utilities using QRCode.toDataURL
export async function generateQRCodeDataURL(data: string): Promise<string> {
  try {
    // Dynamically import qrcode library
    const QRCode = (await import('qrcode')).default
    const dataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    })
    return dataURL
  } catch (error) {
    console.error('QR code generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeCanvas(data: string, canvas: HTMLCanvasElement): Promise<void> {
  try {
    const QRCode = (await import('qrcode')).default
    await QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    })
  } catch (error) {
    console.error('QR code canvas generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

export function createPaymentQRData(paymentId: string, amount: number, currency: string = 'NGN'): string {
  // Format: qrpay://paymentId?amount=X&currency=Y
  return `qrpay://${paymentId}?amount=${amount}&currency=${currency}`
}

export function downloadQRCode(dataURL: string, filename: string = 'payment-qr.png'): void {
  const link = document.createElement('a')
  link.href = dataURL
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function copyQRDataToClipboard(dataURL: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const blob = await (await fetch(dataURL)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      resolve()
    } catch (error) {
      console.error('Clipboard copy error:', error)
      reject(error)
    }
  })
}

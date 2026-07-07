import { Receipt } from '@/lib/db/models/receipt.types'

export interface ReceiptData {
  transactionId: string
  amount: number
  currency: string
  status: string
  timestamp: Date
  cashierName: string
  storeName: string
  customerEmail?: string
  items?: Array<{ description: string; amount: number }>
  paymentMethod?: string
}

export function formatReceiptHTML(receipt: ReceiptData): string {
  const date = new Date(receipt.timestamp).toLocaleString()
  const items = receipt.items || []

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: monospace; width: 300px; margin: 0; padding: 10px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; }
        .store-info { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
        .divider { border-top: 2px dashed #333; margin: 15px 0; }
        .line { display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0; }
        .label { font-weight: bold; }
        .items { margin: 15px 0; }
        .item { display: flex; justify-content: space-between; font-size: 12px; margin: 3px 0; }
        .total { font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; margin-top: 10px; }
        .status { text-align: center; margin-top: 15px; padding: 5px; background: #f0f0f0; font-weight: bold; font-size: 12px; }
        .footer { text-align: center; font-size: 10px; color: #999; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RECEIPT</h1>
      </div>
      
      <div class="store-info">
        <p>${receipt.storeName}</p>
        <p>Cashier: ${receipt.cashierName}</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="line">
        <span class="label">Transaction ID:</span>
        <span>${receipt.transactionId}</span>
      </div>
      
      <div class="line">
        <span class="label">Date:</span>
        <span>${date}</span>
      </div>
      
      ${receipt.customerEmail ? `
      <div class="line">
        <span class="label">Customer:</span>
        <span>${receipt.customerEmail}</span>
      </div>
      ` : ''}
      
      ${receipt.paymentMethod ? `
      <div class="line">
        <span class="label">Payment Method:</span>
        <span>${receipt.paymentMethod}</span>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      
      ${items.length > 0 ? `
      <div class="items">
        ${items.map(item => `
          <div class="item">
            <span>${item.description}</span>
            <span>${item.amount.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="divider"></div>
      ` : ''}
      
      <div class="total">
        <span>TOTAL:</span>
        <span>${receipt.amount.toFixed(2)} ${receipt.currency}</span>
      </div>
      
      <div class="status">
        Status: ${receipt.status.toUpperCase()}
      </div>
      
      <div class="footer">
        <p>Thank you for your payment</p>
        <p>Powered by QR Cashless System</p>
      </div>
    </body>
    </html>
  `
}

export function printReceipt(receipt: ReceiptData): void {
  const html = formatReceiptHTML(receipt)
  const printWindow = window.open('', '', 'width=400,height=600')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }
}

export function downloadReceiptAsText(receipt: ReceiptData): void {
  const lines = [
    '='.repeat(40),
    'RECEIPT'.padStart(22),
    '='.repeat(40),
    '',
    `Store: ${receipt.storeName}`,
    `Cashier: ${receipt.cashierName}`,
    '',
    '-'.repeat(40),
    `Transaction ID: ${receipt.transactionId}`,
    `Date: ${new Date(receipt.timestamp).toLocaleString()}`,
    receipt.customerEmail ? `Customer: ${receipt.customerEmail}` : '',
    receipt.paymentMethod ? `Payment: ${receipt.paymentMethod}` : '',
    '',
    '-'.repeat(40),
  ]

  if (receipt.items && receipt.items.length > 0) {
    receipt.items.forEach(item => {
      lines.push(`${item.description.padEnd(30)} ${item.amount.toFixed(2)}`)
    })
    lines.push('-'.repeat(40))
  }

  lines.push(
    `TOTAL: ${receipt.amount.toFixed(2)} ${receipt.currency}`.padStart(40),
    '',
    `Status: ${receipt.status.toUpperCase()}`,
    '',
    'Thank you for your payment',
    'Powered by QR Cashless System',
    '='.repeat(40),
  )

  const text = lines.filter(line => line).join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `receipt-${receipt.transactionId}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

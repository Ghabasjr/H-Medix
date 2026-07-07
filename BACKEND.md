# Firebase Backend Architecture

## Overview

Phase 3 implements a complete Firebase backend architecture with Firestore collections, TypeScript models, service layer, custom React hooks, and security rules. This foundation supports all payment processing, transaction management, and business logic for the QR Cashless Transaction System.

## Database Schema (Firestore)

### 1. Users Collection (`users/{uid}`)
Authenticated users with roles and status.

**Fields:**
- `uid` (string): Firebase Auth UID
- `email` (string): User email
- `displayName` (string): Full name
- `photoURL` (string, optional): Profile picture
- `role` (enum): `admin` | `cashier` | `customer`
- `emailVerified` (boolean): Email verification status
- `lastLogin` (timestamp, optional): Last login time
- `status` (enum): `active` | `suspended` | `deleted`
- `createdAt` (timestamp): Document creation time
- `updatedAt` (timestamp): Last update time

### 2. Customers Collection (`customers/{id}`)
Customer profiles linked to users, tracks spending and transaction count.

**Fields:**
- `uid` (string): Foreign key to users
- `phone` (string, optional): Contact number
- `address`, `city`, `state`, `zipCode`, `country` (strings): Address info
- `totalSpent` (number): Cumulative amount spent
- `transactionCount` (number): Total transactions
- `createdAt`, `updatedAt` (timestamps)

### 3. Cashiers Collection (`cashiers/{id}`)
Cashier staff linked to stores for payment processing.

**Fields:**
- `uid` (string): Foreign key to users
- `storeId` (string): Foreign key to stores
- `phone` (string): Contact number
- `employeeId` (string): Employee identifier
- `salary` (number): Employment salary
- `hireDate` (timestamp): Employment date
- `status` (enum): `active` | `inactive` | `terminated`
- `createdAt`, `updatedAt` (timestamps)

### 4. Stores Collection (`stores/{id}`)
Business locations that process payments.

**Fields:**
- `name` (string): Store name
- `description` (string, optional): Store description
- `ownerId` (string): Foreign key to users (admin)
- `address`, `city`, `state`, `zipCode`, `country` (strings): Location
- `phone`, `email` (strings): Contact info
- `logo` (string, optional): URL to store logo
- `currency` (string): ISO 4217 currency code (e.g., "USD")
- `timezone` (string): IANA timezone (e.g., "America/New_York")
- `status` (enum): `active` | `inactive` | `suspended`
- `createdAt`, `updatedAt` (timestamps)

### 5. Transactions Collection (`transactions/{id}`)
Payment transactions with full itemization.

**Fields:**
- `storeId` (string): Foreign key to stores
- `cashierId` (string): Foreign key to cashiers
- `customerId` (string): Foreign key to customers
- `amount` (number): Transaction amount
- `currency` (string): Currency code
- `status` (enum): `pending` | `processing` | `completed` | `failed` | `refunded`
- `paymentMethod` (enum): `qr_code` | `card` | `cash` | `wallet`
- `description` (string, optional): Transaction notes
- `items` (array): Transaction items with {name, quantity, price, total}
- `discount`, `tax`, `total` (numbers): Pricing breakdown
- `paymentId`, `receiptId` (strings, optional): Foreign keys
- `completedAt` (timestamp, optional): Completion time
- `createdAt`, `updatedAt` (timestamps)

### 6. Payments Collection (`payments/{id}`)
Payment processing records tracking authorization and capture.

**Fields:**
- `transactionId` (string): Foreign key to transactions
- `storeId` (string): Foreign key to stores
- `customerId` (string): Foreign key to customers
- `amount`, `currency` (number, string): Payment details
- `status` (enum): `initiated` | `pending` | `authorized` | `captured` | `failed` | `refunded`
- `paymentGateway` (string): Gateway name (e.g., "stripe", "paypal")
- `gatewayReference` (string): External payment ID
- `authorizationCode` (string, optional): Auth code from gateway
- `errorCode`, `errorMessage` (strings, optional): Error details
- `metadata` (object): Custom data (e.g., customer IP, device info)
- `authorizedAt`, `capturedAt` (timestamps, optional)
- `createdAt`, `updatedAt` (timestamps)

### 7. QR Payments Collection (`qrPayments/{id}`)
Generated QR codes for payment requests.

**Fields:**
- `storeId` (string): Foreign key to stores
- `cashierId` (string): Foreign key to cashiers
- `qrCode` (string): Unique QR code identifier
- `qrImage` (string): URL to QR code image
- `amount` (number): Payment amount
- `currency` (string): Currency code
- `status` (enum): `active` | `expired` | `used` | `cancelled`
- `validUntil` (timestamp): Expiration time
- `transactionId` (string, optional): Foreign key to transactions (after use)
- `metadata` (object): Custom data
- `usedAt` (timestamp, optional): Usage time
- `createdAt`, `updatedAt` (timestamps)

### 8. Receipts Collection (`receipts/{id}`)
Transaction receipts for record keeping.

**Fields:**
- `transactionId` (string): Foreign key to transactions
- `storeId` (string): Foreign key to stores
- `customerId` (string): Foreign key to customers
- `receiptNumber` (string): Unique receipt identifier
- `items` (array): Receipt items
- `subtotal`, `tax`, `discount`, `total` (numbers): Amount breakdown
- `paymentMethod` (string): Payment method used
- `receiptUrl` (string, optional): URL to generated receipt
- `printedAt` (timestamp, optional): Print time
- `sentViaSMS`, `sentViaEmail` (booleans): Delivery status
- `createdAt`, `updatedAt` (timestamps)

### 9. Notifications Collection (`notifications/{id}`)
User notifications for events and alerts.

**Fields:**
- `userId` (string): Foreign key to users
- `type` (enum): `payment_success` | `payment_failed` | `receipt` | `alert` | `system`
- `title` (string): Notification title
- `message` (string): Notification body
- `data` (object): Custom data (e.g., transaction details)
- `read` (boolean): Read status
- `readAt` (timestamp, optional): Read time
- `sentVia` (array): Delivery channels - `sms` | `email` | `in_app`
- `createdAt`, `updatedAt` (timestamps)

### 10. Settings Collection (`settings/{id}`)
Configuration settings for stores and users.

**Fields:**
- `storeId` (string, optional): Foreign key to stores
- `userId` (string, optional): Foreign key to users
- `key` (string): Setting key (e.g., "email_notifications_enabled")
- `value` (any): Setting value
- `type` (enum): `string` | `number` | `boolean` | `json`
- `updatedAt` (timestamp)

### 11. Audit Logs Collection (`auditLogs/{id}`)
Complete audit trail of all actions for compliance.

**Fields:**
- `userId` (string): Foreign key to users (who performed action)
- `storeId` (string, optional): Foreign key to stores
- `action` (string): Action type (e.g., "transaction_created", "payment_processed")
- `resource` (string): Resource type (e.g., "transaction", "payment")
- `resourceId` (string): ID of affected resource
- `changes` (object): Before/after values {before: {}, after: {}}
- `ipAddress` (string, optional): Source IP
- `userAgent` (string, optional): Browser info
- `status` (enum): `success` | `failed`
- `errorMessage` (string, optional): Error details
- `createdAt`, `updatedAt` (timestamps)

## Directory Structure

```
lib/
├── db/
│   ├── types.ts                    # Shared types and enums
│   ├── models/                     # TypeScript model definitions
│   │   ├── user.types.ts
│   │   ├── customer.types.ts
│   │   ├── cashier.types.ts
│   │   ├── store.types.ts
│   │   ├── transaction.types.ts
│   │   ├── payment.types.ts
│   │   ├── qrPayment.types.ts
│   │   ├── receipt.types.ts
│   │   ├── notification.types.ts
│   │   ├── setting.types.ts
│   │   ├── auditLog.types.ts
│   │   └── index.ts               # Re-export all models
│   └── services/                   # Firestore operations
│       ├── firestoreService.ts     # Base service (CRUD)
│       ├── userService.ts
│       ├── customerService.ts
│       ├── storeService.ts
│       ├── transactionService.ts
│       ├── paymentService.ts
│       ├── qrPaymentService.ts
│       ├── receiptService.ts
│       ├── notificationService.ts
│       ├── settingService.ts
│       ├── auditLogService.ts
│       └── index.ts               # Re-export all services
├── hooks/                          # React hooks for data fetching
│   ├── useFirestore.ts            # Generic real-time listener
│   ├── useUser.ts                 # User data hook
│   ├── useTransactions.ts         # Transaction data hooks
│   ├── useStores.ts               # Store data hooks
│   ├── useNotifications.ts        # Notification hooks
│   └── index.ts                   # Re-export all hooks
└── firebase/
    └── config.ts                  # Firebase initialization
firebase/
├── firestore.rules                # Firestore security rules
└── firestore.indexes.json         # Composite index definitions
```

## Service Layer Usage

### Import Services
```typescript
import { userService, transactionService } from '@/lib/db/services'
```

### CRUD Operations
```typescript
// Create
const response = await userService.createUser({
  uid: 'firebase-uid',
  email: 'user@example.com',
  displayName: 'John Doe',
  role: 'customer'
})

// Read
const user = await userService.getUserById('user-id')

// Update
await userService.updateUser('user-id', { displayName: 'Jane Doe' })

// Delete (soft delete - sets status: 'deleted')
await userService.deleteUser('user-id')
```

### Query with Filters
```typescript
// Get transactions for a store
const transactions = await transactionService.getTransactionsByStore('store-id')

// Get completed transactions
const completed = await transactionService.getTransactionsByStatus('store-id', 'completed')
```

## Custom Hooks Usage

### Real-time Transactions Hook
```typescript
'use client'

import { useTransactions } from '@/lib/hooks'

export function StoreTransactions({ storeId }) {
  const { transactions, loading, error } = useTransactions(storeId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {transactions.map(tx => (
        <li key={tx.id}>{tx.total}</li>
      ))}
    </ul>
  )
}
```

### User Data Hook
```typescript
const { user, loading, error } = useUser(userId)
```

### Notifications Hook
```typescript
const { notifications, loading } = useNotifications(userId)
const { unreadCount, loading } = useUnreadNotifications(userId)
```

## Firestore Security Rules

Rules enforce:
- **Role-based access**: Admin > Store Owner > Cashier > Customer
- **Data isolation**: Users can only see their own data
- **Audit logging**: All writes require createdAt/updatedAt
- **Soft deletes**: No hard deletes (status: 'deleted' instead)

Rules file: `firebase/firestore.rules`

### Access Patterns
- **Admin**: Can read/write all data
- **Store Owner**: Can manage their store and staff
- **Cashier**: Can process transactions for their store
- **Customer**: Can read own data and receipts
- **Audit Logs**: Write-only via Cloud Functions

## Firestore Indexes

Composite indexes optimize queries for:
- Transactions by store and date
- Payments by store and status
- QR Payments by store and status
- Audit logs by store and date
- Notifications by user, read status, and date

Indexes file: `firebase/firestore.indexes.json`

Deploy with: `firebase deploy --only firestore:indexes`

## Error Handling

All services return `ServiceResponse<T>`:
```typescript
interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

// Usage
const response = await userService.getUserById('id')
if (response.success) {
  console.log(response.data)
} else {
  console.error(response.error)
}
```

## Next Steps (Phase 4+)

1. **Cloud Functions**: Implement payment processing, notifications, receipts
2. **Admin Dashboard**: Build analytics and reporting
3. **Cashier Interface**: Payment QR code generation
4. **Customer Portal**: Payment page with QR scanning
5. **Email Integration**: Automated receipt delivery
6. **Advanced Audit**: Compliance reporting and exports

## Deployment

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### Deploy Cloud Functions
```bash
firebase deploy --only functions
```

## Testing

Test services with mock data:
```typescript
// Create test user
const user = await userService.createUser({
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'customer'
})

// Create test store
const store = await storeService.createStore({
  name: 'Test Store',
  ownerId: 'admin-uid',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA',
  phone: '555-0000',
  email: 'store@example.com',
  currency: 'USD',
  timezone: 'America/New_York'
})
```

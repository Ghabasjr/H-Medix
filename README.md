# QR Cashless Transaction System

A production-ready fintech SaaS application for secure QR-based cashless payments. Built with Next.js 16, React 19, Firebase, and TailwindCSS.

## Overview

The QR Cashless Transaction System provides a modern payment infrastructure with three distinct user roles:

- **Administrator**: Manages the system, analytics, and all transactions
- **Cashier**: Generates QR codes and processes payments
- **Customer**: Scans QR codes and makes payments

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Cloud Functions, Storage)
- **State Management**: React Context API
- **Authentication**: Firebase Auth (Email/Password + Google OAuth)

## Features

###  Phase 1: Foundation
- User authentication (Email/Password + Google OAuth)
- Role-based access control (Admin, Cashier, Customer)
- Dark/Light mode support with localStorage persistence
- Toast notification system
- Responsive navigation and layout
- Protected routes with role-based redirects
- Form validation with error handling
- Reusable UI component library

###  Phase 2: Landing Page
- Premium fintech-inspired landing page
- Hero section with trust indicators
- Features showcase, how-it-works, testimonials, and pricing sections
- CTA-focused design for conversion
- Responsive mobile-first implementation

###  Phase 3: Firebase Backend Architecture
- **TypeScript Models**: Type definitions for all 11 Firestore collections
- **Service Layer**: CRUD operations for Users, Customers, Cashiers, Stores, Transactions, Payments, QR Payments, Receipts, Notifications, Settings, and Audit Logs
- **Custom React Hooks**: Real-time data fetching with `useFirestore`, `useUser`, `useTransactions`, `useStores`, and `useNotifications`
- **Firestore Security Rules**: Role-based access control with granular permissions
- **Composite Indexes**: Optimized queries for high-volume transaction data

###  Coming in Phase 4+
- Admin dashboard with analytics and reporting
- Cashier payment processing interface
- Customer payment portal with QR scanning
- Receipt generation and email delivery
- Cloud Functions for payment processing and notifications
- Advanced audit logging and compliance reporting

## Architecture

### Firestore Collections
The backend consists of 11 interconnected collections:
- **users**: Authenticated users with roles (admin, cashier, customer)
- **customers**: Customer profiles with transaction history
- **cashiers**: Cashier staff linked to stores
- **stores**: Business locations with settings
- **transactions**: Payment transactions
- **payments**: Payment processing records
- **qrPayments**: Generated QR codes for payments
- **receipts**: Transaction receipts
- **notifications**: User notifications
- **settings**: Store and user configuration
- **auditLogs**: Action audit trail for compliance

### Service Layer
All database operations go through TypeScript service classes in `lib/db/services/` that provide:
- Type-safe CRUD operations
- Soft-delete patterns (status = 'deleted' instead of hard delete)
- Automatic timestamp management (createdAt, updatedAt)
- Consistent error handling with ServiceResponse types

### Real-time Hooks
React hooks in `lib/hooks/` provide real-time data subscriptions:
- `useFirestore()`: Generic real-time listener
- `useUser()`: User profile data
- `useTransactions()`: Store/customer transactions
- `useStores()`: User's stores
- `useNotifications()`: User notifications

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Firebase project with Auth and Firestore enabled
- Google OAuth credentials (for Google login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-cashless-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the template
   cp .env.example .env.development.local

   # Fill in your Firebase configuration
   # Get these from your Firebase project settings
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects)
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   └── dashboard/               # Protected dashboard
│       ├── layout.tsx
│       ├── page.tsx
│       ├── admin/
│       ├── cashier/
│       └── customer/
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── layout/                  # Layout components
│   ├── providers/               # Context providers
│   └── ProtectedRoute.tsx       # Route protection wrapper
├── contexts/                    # React contexts
│   ├── AuthContext.tsx          # Auth state
│   ├── ThemeContext.tsx         # Theme state
│   └── ToastContext.tsx         # Toast notifications
├── lib/
│   ├── auth/                    # Auth service layer
│   ├── firebase/                # Firebase configuration
│   ├── utils/                   # Utility functions
│   └── constants/               # App constants
└── public/                      # Static assets
```

## Authentication Flow

### Sign Up
1. User enters email, password, name, and role
2. Password validation: min 6 chars, uppercase, lowercase, numbers
3. Account created in Firebase Auth
4. User document created in Firestore
5. Automatic login and redirect to dashboard

### Login
1. User enters email and password
2. Firebase authenticates credentials
3. User document fetched from Firestore
4. Session maintained via Firebase Auth
5. Redirect to role-specific dashboard

### Google OAuth
1. User clicks "Login with Google"
2. Google credential obtained
3. User document created if new
4. Automatic login and redirect

## Routing & Access Control

| Route | Public | Auth Required | Roles | Purpose |
|-------|--------|---------------|-------|---------|
| `/` | ✓ | - | - | Redirects to login/dashboard |
| `/auth/login` | ✓ | ✗ | - | Login form |
| `/auth/signup` | ✓ | ✗ | - | Sign up form |
| `/dashboard` | ✗ | ✓ | All | Role-aware redirect |
| `/dashboard/admin` | ✗ | ✓ | Admin | Admin dashboard |
| `/dashboard/cashier` | ✗ | ✓ | Cashier | Cashier dashboard |
| `/dashboard/customer` | ✗ | ✓ | Customer | Customer dashboard |

## Customization

### Add Environment Variables
Edit `.env.development.local` to add new variables:
```bash
NEXT_PUBLIC_VAR_NAME=value
```

### Modify Colors & Theme
Edit `app/globals.css` to update color variables in `:root` and `.dark` selectors.

### Add New UI Components
Create components in `components/ui/` following the existing pattern.

### Extend Authentication
Add providers in `lib/auth/service.ts` following the Firebase Auth pattern.

## Development Guidelines

### Code Style
- Use TypeScript strictly
- Components should be split into separate files
- Business logic in service layer (`lib/`)
- No logic in React components

### Component Architecture
```tsx
// ✓ Good
interface CardProps {
  title: string
  children: ReactNode
}

export function Card({ title, children }: CardProps) {
  return <div>...</div>
}

// ✗ Avoid
export function Card(props: any) {
  return <div>...</div>
}
```

### Naming Conventions
- Components: PascalCase (`UserCard.tsx`)
- Files: Match component name or use camelCase for utilities
- Types: PascalCase (`UserRole`, `AuthContext`)
- Constants: UPPER_SNAKE_CASE (`USER_ROLES`, `ROUTES`)

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com and import the project
   - Set environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure Custom Domain**
   - Add domain in Vercel settings
   - Update DNS records

### Production Checklist
- [ ] All Firebase environment variables set
- [ ] Firebase security rules configured
- [ ] Google OAuth credentials configured
- [ ] SSL certificate enabled
- [ ] Analytics and monitoring enabled
- [ ] Error tracking configured
- [ ] Database backup configured

## Troubleshooting

### Firebase Authentication Errors
- **Error**: "apiKey is invalid"
  - Solution: Check `NEXT_PUBLIC_FIREBASE_API_KEY` in environment variables

- **Error**: "Permission denied on document"
  - Solution: Update Firebase Firestore security rules

### Build Errors
- **Error**: "Module not found"
  - Solution: Run `pnpm install` to ensure dependencies are installed

- **Error**: "Type errors in build"
  - Solution: Run `pnpm tsc --noEmit` to check for TypeScript errors

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes following code guidelines
3. Test thoroughly in development
4. Create a pull request with description

## Roadmap

### Phase 1 ✅
- Authentication system
- Role-based access control
- Theme system
- UI component library

### Phase 2 🚀
- Admin dashboard with analytics
- QR code generation
- Payment processing flow
- Transaction management

### Phase 3
- Receipt generation
- Email notifications
- Audit logging
- Advanced reporting

### Phase 4
- Mobile app integration
- API documentation
- Webhook system
- Third-party integrations

## Support

For support, issues, or feature requests:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Contact the development team
4. Open a new issue with detailed description

## License

MIT License - See LICENSE.md for details

## Security

- Never commit `.env.development.local` with real credentials
- Always use HTTPS in production
- Keep dependencies updated
- Enable Firebase security rules
- Use rate limiting for APIs
- Validate all user inputs server-side

---

**Last Updated**: Phase 1 Foundation Complete  
**Next**: Phase 2 - Dashboard Implementation

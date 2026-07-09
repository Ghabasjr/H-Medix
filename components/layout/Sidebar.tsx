'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/app'

const menuItems = {
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    // { label: 'Customers', href: '/dashboard/admin/customers', icon: Users },
    // { label: 'Cashiers', href: '/dashboard/admin/cashiers', icon: Users },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: Wallet },
    { label: 'Reports', href: '/dashboard/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  cashier: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD_CASHIER, icon: LayoutDashboard },
    { label: 'Payments', href: ROUTES.DASHBOARD_CASHIER, icon: CreditCard },
    { label: 'Transactions', href: ROUTES.DASHBOARD_CASHIER, icon: Wallet },
  ],
  customer: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD_CUSTOMER, icon: LayoutDashboard },
    { label: 'Pay Now', href: ROUTES.DASHBOARD_CUSTOMER, icon: CreditCard },
  ],
}

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const items = menuItems[user.role] || []

  const navigation = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-primary">QR Cashless</h1>
        {onMobileClose && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileClose}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link key={item.label} href={item.href} onClick={onMobileClose}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-sidebar-primary text-sidebar-primary-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="text-sm">
          <p className="font-medium text-sidebar-foreground truncate">{user.displayName}</p>
          <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onMobileClose?.()
            logout()
          }}
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar text-sidebar-foreground">
        {navigation}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
            aria-label="Close navigation menu"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-sidebar text-sidebar-foreground shadow-xl">
            {navigation}
          </aside>
        </div>
      )}
    </>
  )
}

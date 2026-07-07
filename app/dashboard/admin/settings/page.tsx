'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ManagementPageLayout } from '@/components/admin/management/ManagementPageLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Settings, Bell, Lock, FileText } from 'lucide-react'

export default function SettingsPage() {
  const [currency, setCurrency] = useState('NGN')
  const [timezone, setTimezone] = useState('WAT')
  const [platformName, setPlatformName] = useState('H-Medix Cashless Payment System')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [transactionThreshold, setTransactionThreshold] = useState('1000')

  const handleSave = () => {
    console.log(' Saving settings')
    // TODO: Implement save to Firestore
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <ManagementPageLayout
        title="System Settings"
        description="Configure system-wide settings and preferences"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Navigation */}
          <div className="space-y-2">
            <nav className="space-y-1">
              {[
                { icon: Settings, label: 'General', id: 'general' },
                { icon: Bell, label: 'Notifications', id: 'notifications' },
                { icon: Lock, label: 'Security', id: 'security' },
                { icon: FileText, label: 'Audit', id: 'audit' },
              ].map(({ icon: Icon, label, id }) => (
                <button
                  key={id}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg hover:bg-muted"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure general system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    placeholder="Platform name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <div className="w-full rounded border bg-muted px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground">NGN (₦) — Nigerian Naira</span>
                      <span className="ml-auto text-xs">(locked)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    >
                      <option value="WAT">West Africa Time (WAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="CST">Central Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive email updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alert Threshold (NGN ₦)</label>
                    <Input
                      type="number"
                      value={transactionThreshold}
                      onChange={(e) => setTransactionThreshold(e.target.value)}
                      placeholder="Amount threshold"
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when transaction exceeds this amount
                    </p>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">API Keys</p>
                  <p className="text-xs text-muted-foreground">
                    Manage API keys for integrations
                  </p>
                  <Button variant="outline" size="sm">
                    Manage API Keys
                  </Button>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm font-medium">Password Policy</p>
                  <p className="text-xs text-muted-foreground">
                    Current: Minimum 6 characters with uppercase, lowercase, and numbers
                  </p>
                  <Button variant="outline" size="sm">
                    Configure Policy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit & Compliance
                </CardTitle>
                <CardDescription>Manage audit logs and data retention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Audit Log Retention</p>
                  <select className="w-full rounded border bg-background px-3 py-2 text-sm">
                    <option>30 days</option>
                    <option>90 days</option>
                    <option>1 year</option>
                    <option>Indefinite</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Export Audit Logs</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Download Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ManagementPageLayout>
    </ProtectedRoute>
  )
}

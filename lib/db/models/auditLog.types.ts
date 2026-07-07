import { BaseDocument, AuditActionStatus } from '../types'

export interface AuditLog extends BaseDocument {
  userId: string
  storeId?: string
  action: string
  resource: string
  resourceId: string
  changes: {
    before: Record<string, any>
    after: Record<string, any>
  }
  ipAddress?: string
  userAgent?: string
  status: AuditActionStatus
  errorMessage?: string
}

export interface CreateAuditLogInput {
  userId: string
  storeId?: string
  action: string
  resource: string
  resourceId: string
  changes: {
    before: Record<string, any>
    after: Record<string, any>
  }
  ipAddress?: string
  userAgent?: string
  status: AuditActionStatus
  errorMessage?: string
}

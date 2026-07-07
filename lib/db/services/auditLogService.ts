'use client'

import { FirestoreService } from './firestoreService'
import { AuditLog, CreateAuditLogInput } from '../models/auditLog.types'
import { ServiceResponse, QueryOptions } from '../types'

const COLLECTION_NAME = 'auditLogs'

class AuditLogService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getAuditLogById(id: string): Promise<ServiceResponse<AuditLog>> {
    return this.service.getById<AuditLog>(id)
  }

  async getAuditLogsByUser(
    userId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<AuditLog[]>> {
    return this.service.getAll<AuditLog>(
      [{ field: 'userId', operator: '==', value: userId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getAuditLogsByStore(
    storeId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<AuditLog[]>> {
    return this.service.getAll<AuditLog>(
      [{ field: 'storeId', operator: '==', value: storeId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getAuditLogsByResource(
    resource: string,
    resourceId: string
  ): Promise<ServiceResponse<AuditLog[]>> {
    return this.service.getAll<AuditLog>([
      { field: 'resource', operator: '==', value: resource },
      { field: 'resourceId', operator: '==', value: resourceId },
    ])
  }

  async getFailedAuditLogs(storeId?: string): Promise<ServiceResponse<AuditLog[]>> {
    const filters = [{ field: 'status', operator: '==', value: 'failed' }]

    if (storeId) {
      filters.push({ field: 'storeId', operator: '==', value: storeId })
    }

    return this.service.getAll<AuditLog>(filters)
  }

  async createAuditLog(input: CreateAuditLogInput): Promise<ServiceResponse<AuditLog & { id: string }>> {
    const auditLogData: AuditLog = {
      id: '',
      userId: input.userId,
      storeId: input.storeId,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      changes: input.changes,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      status: input.status,
      errorMessage: input.errorMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<AuditLog>(auditLogData)
  }

  async logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    before: Record<string, any>,
    after: Record<string, any>,
    storeId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ServiceResponse<AuditLog & { id: string }>> {
    return this.createAuditLog({
      userId,
      storeId,
      action,
      resource,
      resourceId,
      changes: { before, after },
      ipAddress,
      userAgent,
      status: 'success',
    })
  }
}

export const auditLogService = new AuditLogService()

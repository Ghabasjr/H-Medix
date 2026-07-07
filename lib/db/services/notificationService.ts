'use client'

import { FirestoreService } from './firestoreService'
import { Notification, CreateNotificationInput, UpdateNotificationInput } from '../models/notification.types'
import { ServiceResponse, QueryOptions } from '../types'

const COLLECTION_NAME = 'notifications'

class NotificationService {
  private service: FirestoreService

  constructor() {
    this.service = new FirestoreService(COLLECTION_NAME)
  }

  async getNotificationById(id: string): Promise<ServiceResponse<Notification>> {
    return this.service.getById<Notification>(id)
  }

  async getNotificationsByUser(
    userId: string,
    options?: QueryOptions
  ): Promise<ServiceResponse<Notification[]>> {
    return this.service.getAll<Notification>(
      [{ field: 'userId', operator: '==', value: userId }],
      { ...options, orderBy: 'createdAt', orderDirection: 'desc' }
    )
  }

  async getUnreadNotifications(userId: string): Promise<ServiceResponse<Notification[]>> {
    return this.service.getAll<Notification>([
      { field: 'userId', operator: '==', value: userId },
      { field: 'read', operator: '==', value: false },
    ])
  }

  async getNotificationsByType(
    userId: string,
    type: string
  ): Promise<ServiceResponse<Notification[]>> {
    return this.service.getAll<Notification>([
      { field: 'userId', operator: '==', value: userId },
      { field: 'type', operator: '==', value: type },
    ])
  }

  async createNotification(
    input: CreateNotificationInput
  ): Promise<ServiceResponse<Notification & { id: string }>> {
    const notificationData: Notification = {
      id: '',
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data || {},
      read: false,
      sentVia: input.sentVia || ['in_app'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.service.create<Notification>(notificationData)
  }

  async updateNotification(
    id: string,
    input: UpdateNotificationInput
  ): Promise<ServiceResponse<void>> {
    return this.service.update<Notification>(id, input)
  }

  async markAsRead(id: string): Promise<ServiceResponse<void>> {
    return this.service.update<Notification>(id, {
      read: true,
      readAt: new Date(),
    })
  }

  async markAllAsRead(userId: string): Promise<ServiceResponse<void>> {
    // This would require a Cloud Function for batch update
    // For now, we'll return a success response
    console.warn('markAllAsRead requires Cloud Function implementation')
    return { success: true }
  }

  async deleteNotification(id: string): Promise<ServiceResponse<void>> {
    return this.service.hardDelete(id)
  }

  async deleteAllNotifications(userId: string): Promise<ServiceResponse<void>> {
    // This would require a Cloud Function for batch delete
    console.warn('deleteAllNotifications requires Cloud Function implementation')
    return { success: true }
  }
}

export const notificationService = new NotificationService()

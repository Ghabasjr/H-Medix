import { BaseDocument, NotificationType, SentVia } from '../types'

export interface Notification extends BaseDocument {
  userId: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  readAt?: Date | FirebaseFirestore.Timestamp
  sentVia: SentVia[]
}

export interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  sentVia?: SentVia[]
}

export interface UpdateNotificationInput {
  read?: boolean
  readAt?: Date
}

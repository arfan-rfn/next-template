/**
 * API response types for settings-related endpoints
 */

export interface DeviceSession {
  id: string
  userId: string
  userAgent: string
  ipAddress: string
  location?: string
  createdAt: string
  lastAccessed: string
  isCurrent: boolean
  deviceType: string
  browser: string
}

export interface SessionsResponse {
  sessions: DeviceSession[]
  total: number
}

export interface NotificationPreferences {
  emailMarketing: boolean
  emailSecurity: boolean
  emailProduct: boolean
  pushNotifications?: boolean
  smsNotifications?: boolean
}

export interface NotificationsResponse {
  preferences: NotificationPreferences
}

export interface UpdateNotificationsRequest {
  preferences: Partial<NotificationPreferences>
}

export interface DeleteAccountRequest {
  confirmation: boolean
}

export interface DeleteAccountResponse {
  success: boolean
  message: string
  deletionScheduled?: string
}

export interface BaseResponse {
  success: boolean
  message: string
}
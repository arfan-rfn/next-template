/**
 * Settings-related API functions
 */

import { apiClient } from './client'
import type {
  SessionsResponse,
  NotificationsResponse,
  UpdateNotificationsRequest,
  DeleteAccountRequest,
  DeleteAccountResponse,
  BaseResponse,
} from './types'

export const settingsAPI = {
  // Session Management
  getSessions: (): Promise<SessionsResponse> => {
    return apiClient.get<SessionsResponse>('/user/session')
  },

  revokeSession: (sessionId: string): Promise<BaseResponse> => {
    return apiClient.delete<BaseResponse>(`/user/session/${sessionId}`)
  },

  revokeAllOtherSessions: (): Promise<BaseResponse> => {
    return apiClient.delete<BaseResponse>('/user/session')
  },

  // Notification Management
  getNotifications: (): Promise<NotificationsResponse> => {
    return apiClient.get<NotificationsResponse>('/user/notifications')
  },

  updateNotifications: (data: UpdateNotificationsRequest): Promise<NotificationsResponse> => {
    return apiClient.put<NotificationsResponse>('/user/notifications', data)
  },

  // Account Management
  deleteAccount: (data: DeleteAccountRequest): Promise<DeleteAccountResponse> => {
    return apiClient.post<DeleteAccountResponse>('/user/delete-account', data)
  },
}
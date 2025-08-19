/**
 * TanStack Query hooks for notification management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { settingsAPI } from '@/lib/api'
import type { NotificationPreferences, UpdateNotificationsRequest } from '@/lib/api/types'

// Query Keys
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  preferences: () => [...notificationQueryKeys.all, 'preferences'] as const,
}

// Queries
export function useNotifications() {
  return useQuery({
    queryKey: notificationQueryKeys.preferences(),
    queryFn: () => settingsAPI.getNotifications(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data.preferences,
  })
}

// Mutations
export function useUpdateNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateNotificationsRequest) => settingsAPI.updateNotifications(data),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.preferences() })

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(notificationQueryKeys.preferences())

      // Optimistically update the cache
      queryClient.setQueryData(
        notificationQueryKeys.preferences(),
        (old: NotificationPreferences | undefined) => {
          return old ? { ...old, ...newData.preferences } : newData.preferences
        }
      )

      return { previousNotifications }
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationQueryKeys.preferences(), context.previousNotifications)
      }
      toast.error('Failed to update notification preferences')
    },
    onSuccess: () => {
      toast.success('Notification preferences updated')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.preferences() })
    },
  })
}

// Helper hook for updating individual notification settings
export function useUpdateNotificationSetting() {
  const updateNotifications = useUpdateNotifications()

  return (key: keyof NotificationPreferences, value: boolean) => {
    updateNotifications.mutate({
      preferences: { [key]: value }
    })
  }
}
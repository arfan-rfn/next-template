/**
 * TanStack Query hooks for session management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import type { BaseResponse } from '@/lib/types/common'

// Session-related types
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

// Query Keys
export const sessionQueryKeys = {
  all: ['sessions'] as const,
  list: () => [...sessionQueryKeys.all, 'list'] as const,
}

// Queries
export function useSessions() {
  return useQuery({
    queryKey: sessionQueryKeys.list(),
    queryFn: () => apiClient.get<SessionsResponse>('/user/session'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.sessions,
  })
}

// Mutations
export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => apiClient.delete<BaseResponse>(`/user/session/${sessionId}`),
    onMutate: async (sessionId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: sessionQueryKeys.list() })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(sessionQueryKeys.list())

      // Optimistically update the cache
      queryClient.setQueryData(sessionQueryKeys.list(), (old: DeviceSession[] | undefined) => {
        return old?.filter((session) => session.id !== sessionId) || []
      })

      return { previousSessions }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousSessions) {
        queryClient.setQueryData(sessionQueryKeys.list(), context.previousSessions)
      }
      toast.error('Failed to revoke session')
    },
    onSuccess: () => {
      toast.success('Session revoked successfully')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() })
    },
  })
}

export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.delete<BaseResponse>('/user/session'),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: sessionQueryKeys.list() })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(sessionQueryKeys.list())

      // Optimistically update the cache - keep only current session
      queryClient.setQueryData(sessionQueryKeys.list(), (old: DeviceSession[] | undefined) => {
        return old?.filter((session) => session.isCurrent) || []
      })

      return { previousSessions }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousSessions) {
        queryClient.setQueryData(sessionQueryKeys.list(), context.previousSessions)
      }
      toast.error('Failed to revoke other sessions')
    },
    onSuccess: () => {
      toast.success('All other sessions revoked successfully')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() })
    },
  })
}
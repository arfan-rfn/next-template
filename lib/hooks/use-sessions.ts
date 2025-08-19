/**
 * TanStack Query hooks for session management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { settingsAPI } from '@/lib/api'
import type { DeviceSession } from '@/lib/api/types'

// Query Keys
export const sessionQueryKeys = {
  all: ['sessions'] as const,
  list: () => [...sessionQueryKeys.all, 'list'] as const,
}

// Queries
export function useSessions() {
  return useQuery({
    queryKey: sessionQueryKeys.list(),
    queryFn: () => settingsAPI.getSessions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.sessions,
  })
}

// Mutations
export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => settingsAPI.revokeSession(sessionId),
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
    onError: (err, sessionId, context) => {
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
    mutationFn: () => settingsAPI.revokeAllOtherSessions(),
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
    onError: (err, variables, context) => {
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
/**
 * TanStack Query hooks for account management
 */

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'

// Account-related types
export interface DeleteAccountRequest {
  confirmation: boolean
}

export interface DeleteAccountResponse {
  success: boolean
  message: string
  deletionScheduled?: string
}

// Mutations
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => 
      apiClient.post<DeleteAccountResponse>('/user/delete-account', data),
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: () => {
      toast.error('Failed to request account deletion')
    },
  })
}
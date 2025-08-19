/**
 * TanStack Query hooks for account management
 */

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { settingsAPI } from '@/lib/api'
import type { DeleteAccountRequest } from '@/lib/api/types'

// Mutations
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => settingsAPI.deleteAccount(data),
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: () => {
      toast.error('Failed to request account deletion')
    },
  })
}
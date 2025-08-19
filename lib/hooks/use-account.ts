/**
 * TanStack Query hooks for account management
 */

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth'
import { env } from '@/env'

// Account-related types
export interface DeleteAccountRequest {
  confirmation: string
}

export interface DeleteAccountResponse {
  success: boolean
  message: string
  deletionScheduled?: string
}

// Mutations
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (data: DeleteAccountRequest) => {
      const session = await authClient.getSession()
      if (!session?.data?.session?.token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.data.session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmation: data.confirmation }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete account: ${response.status} ${errorText}`)
      }

      return response.json() as Promise<DeleteAccountResponse>
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Account deletion request submitted successfully')
      // Sign out the user after successful deletion request
      authClient.signOut()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to request account deletion')
    },
  })
}
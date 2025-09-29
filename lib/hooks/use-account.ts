/**
 * TanStack Query hooks for account management
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth'
import { apiClient, APIError } from '@/lib/api/client'
import { userKeys } from './use-user'

// Account-related types
export interface DeleteAccountRequest {
  confirmation: string
}

export interface DeleteAccountResponse {
  success: boolean
  message: string
  deletionScheduled?: string
}

export interface UpdateProfileRequest {
  name?: string
  bio?: string
  image?: string // fileId for new uploads, or existing URL/fileId for unchanged
  profileCompleted?: boolean
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  user: any // Better Auth user type
}

export interface CompleteProfileRequest {
  name: string
}

export interface CompleteProfileResponse {
  success: boolean
  message: string
  user: any // Better Auth user type
}

// Mutations
export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DeleteAccountRequest) => {
      const session = await authClient.getSession()
      if (!session?.data?.session?.token) {
        throw new Error('No authentication token found')
      }

      return apiClient.delete<DeleteAccountResponse>('/user',
        { confirmation: data.confirmation },
        {
          headers: {
            'Authorization': `Bearer ${session.data.session.token}`,
          },
        }
      )
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Account deletion request submitted successfully')
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      // Sign out the user after successful deletion request
      authClient.signOut()
    },
    onError: (error) => {
      const message = error instanceof APIError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Failed to request account deletion'
      toast.error(message)
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const session = await authClient.getSession()
      if (!session?.data?.session?.token) {
        throw new Error('No authentication token found')
      }

      return apiClient.patch<UpdateProfileResponse>('/user', data, {
        headers: {
          'Authorization': `Bearer ${session.data.session.token}`,
        },
      })
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Profile updated successfully')
      // Invalidate and refetch user queries to get updated data
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => {
      const message = error instanceof APIError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Failed to update profile'
      toast.error(message)
    },
  })
}

export function useCompleteProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CompleteProfileRequest) => {
      const session = await authClient.getSession()
      if (!session?.data?.session?.token) {
        throw new Error('No authentication token found')
      }

      return apiClient.post<CompleteProfileResponse>('/user/complete-profile',
        { name: data.name },
        {
          headers: {
            'Authorization': `Bearer ${session.data.session.token}`,
          },
        }
      )
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Profile completed successfully')
      // Invalidate and refetch user queries to get updated data
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => {
      const message = error instanceof APIError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Failed to complete profile'
      toast.error(message)
    },
  })
}
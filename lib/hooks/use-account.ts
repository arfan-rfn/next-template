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

export interface UpdateProfileRequest {
  name?: string
  bio?: string
  image?: string
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

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const session = await authClient.getSession()
      if (!session?.data?.session?.token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.data.session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`)
      }

      return response.json() as Promise<UpdateProfileResponse>
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Profile updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

export function useCompleteProfile() {
  return useMutation({
    mutationFn: async (data: CompleteProfileRequest) => {
      const session = await authClient.getSession()
      if (!session?.data?.session?.token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/user/complete-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.data.session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to complete profile: ${response.status} ${errorText}`)
      }

      return response.json() as Promise<CompleteProfileResponse>
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Profile completed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to complete profile')
    },
  })
}
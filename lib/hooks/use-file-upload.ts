import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiClient, APIError } from '@/lib/api/client'
import { toast } from 'sonner'

interface UploadRequestData {
  fileName: string
  fileType: string
  fileSize: number
  visibility?: 'private' | 'public' | 'unlisted' | 'shared'
  generatePublicUrl?: boolean
}

interface UploadResponse {
  json: {
    uploadId: string
    uploadUrl: string
    storageKey: string
    expiresAt: string
    maxSize: number
  }
  status: number
  success: boolean
}

interface ConfirmUploadResponse {
  success: boolean
  file: {
    id: string
    url: string
    publicUrl?: string
    metadata: Record<string, any>
    status: string
  }
}

export interface FileUploadState {
  isUploading: boolean
  progress: number
  error: string | null
  uploadedFile: ConfirmUploadResponse['file'] | null
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedFile: null,
  })

  const requestUploadMutation = useMutation({
    mutationFn: async (data: UploadRequestData): Promise<UploadResponse> => {
      return apiClient.post<UploadResponse>('/upload/request', data)
    },
    onError: (error) => {
      const errorMessage = error instanceof APIError
        ? `Upload request failed: ${error.message}`
        : 'Failed to request upload URL'
      setUploadState(prev => ({ ...prev, error: errorMessage }))
      toast.error(errorMessage)
    },
  })

  const confirmUploadMutation = useMutation({
    mutationFn: async (uploadId: string): Promise<ConfirmUploadResponse> => {
      return apiClient.post<ConfirmUploadResponse>(`/upload/confirm/${uploadId}`)
    },
    onError: (error) => {
      const errorMessage = error instanceof APIError
        ? `Upload confirmation failed: ${error.message}`
        : 'Failed to confirm upload'
      setUploadState(prev => ({ ...prev, error: errorMessage }))
      toast.error(errorMessage)
    },
  })

  const uploadToStorage = useCallback(async (file: File, uploadUrl: string): Promise<void> => {
    try {
      // Simulate progress during upload since fetch doesn't provide upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 20, 90)
          return { ...prev, progress: Math.round(newProgress) }
        })
      }, 200)

      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file // The actual File object
      })

      clearInterval(progressInterval)

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Unknown error')
        console.error('Upload failed:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          errorText,
          url: uploadUrl
        })
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${uploadResponse.statusText}`)
      }

      // Set progress to 100% when upload completes
      setUploadState(prev => ({ ...prev, progress: 100 }))
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }, [])

  const uploadFile = useCallback(async (
    file: File,
    options: {
      visibility?: 'private' | 'public' | 'unlisted' | 'shared'
      generatePublicUrl?: boolean
    } = {}
  ): Promise<ConfirmUploadResponse['file'] | null> => {
    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        uploadedFile: null,
      })

      // Step 1: Request upload URL
      const uploadRequest: UploadRequestData = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        visibility: options.visibility || 'private',
        generatePublicUrl: options.generatePublicUrl || false,
      }

      const uploadResponse = await requestUploadMutation.mutateAsync(uploadRequest)

      // Extract data from the wrapped response
      const { uploadId, uploadUrl, maxSize } = uploadResponse.json

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`)
      }

      // Step 2: Upload file to storage
      await uploadToStorage(file, uploadUrl)

      // Step 3: Confirm upload
      const confirmResponse = await confirmUploadMutation.mutateAsync(uploadId)

      if (!confirmResponse.success) {
        throw new Error('Upload confirmation failed')
      }

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedFile: confirmResponse.file,
      }))

      toast.success('File uploaded successfully!')
      return confirmResponse.file

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }))
      toast.error(errorMessage)
      return null
    }
  }, [requestUploadMutation, confirmUploadMutation, uploadToStorage])

  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      uploadedFile: null,
    })
  }, [])

  return {
    uploadFile,
    resetUpload,
    ...uploadState,
  }
}
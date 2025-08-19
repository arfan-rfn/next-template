/**
 * Base API client configuration for all backend requests
 * Supports Next.js fetch extensions for caching and revalidation
 */

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'APIError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorMessage = `API Error: ${response.status} ${response.statusText}`
    throw new APIError(errorMessage, response.status, response)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  
  return response.text() as unknown as T
}

// Extend RequestInit to include Next.js specific fetch options
interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  // Next.js specific options
  next?: {
    revalidate?: number | false  // ISR revalidation time in seconds
    tags?: string[]              // Cache tags for on-demand revalidation
  }
  // Override cache with Next.js specific values
  cache?: 'force-cache' | 'no-store' | 'no-cache' | 'reload' | 'only-if-cached'
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || ''

// Default options that can be overridden
const defaultOptions: FetchOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
}

export const apiClient = {
  get: async <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      },
    })
    return handleResponse<T>(response)
  },

  post: async <T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      method: 'POST',
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  put: async <T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      method: 'PUT',
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  delete: async <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      method: 'DELETE',
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      },
    })
    return handleResponse<T>(response)
  },
}

export { APIError }
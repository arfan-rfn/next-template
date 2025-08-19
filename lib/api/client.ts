/**
 * Base API client configuration for all backend requests
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

const baseURL = process.env.NEXT_PUBLIC_API_URL || ''

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<T>(response)
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<T>(response)
  },
}

export { APIError }
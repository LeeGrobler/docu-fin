const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

type LoginResponse = {
  token: string
  message: string
}

export const DOCUMENT_STATUSES = ['draft', 'awaiting_signature', 'signed'] as const

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export type Document = {
  id: string
  tenantId: string
  identifier: string
  title: string
  status: DocumentStatus
  createdAt: string
  updatedAt: string
}

type DocumentsResponse = {
  documents: Document[]
  message: string
}

type DocumentResponse = {
  document: Document
  message: string
}

type ApiRequestOptions = RequestInit & {
  token?: string | null
}

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json()
    return body.error?.message ?? body.message ?? 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { token, ...fetchOptions } = options
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return await response.json() as T
}

export function loginRequest(email: string, password: string) {
  return apiRequest<LoginResponse>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function listDocumentsRequest(token: string | null, search?: string) {
  const params = new URLSearchParams()

  if (search) {
    params.set('search', search)
  }

  return apiRequest<DocumentsResponse>(`/api/document${params.size ? `?${params}` : ''}`, {
    token,
  })
}

export function updateDocumentStatusRequest(token: string | null, documentId: string, status: DocumentStatus) {
  return apiRequest<DocumentResponse>(`/api/document/${documentId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  })
}

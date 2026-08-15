const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

type LoginResponse = {
  token: string
  message: string
}

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json()
    return body.error?.message ?? body.message ?? 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
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

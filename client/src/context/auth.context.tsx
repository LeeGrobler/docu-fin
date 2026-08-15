import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { loginRequest } from '../api/client'

const STORAGE_KEY = 'docufin_token'

export type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')

  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY))

  const value = useMemo<AuthContextValue>(() => {
    const login = async (email: string, password: string) => {
      const response = await loginRequest(email, password)
      localStorage.setItem(STORAGE_KEY, response.token)
      setToken(response.token)
    }

    const logout = () => {
      localStorage.removeItem(STORAGE_KEY)
      setToken(null)
    }

    return {
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }
  }, [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

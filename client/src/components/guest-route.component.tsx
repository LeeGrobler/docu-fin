import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/auth.context'

export default function GuestRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/documents" replace />
  }

  return <Outlet />
}

import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './components/app-layout.component'
import GuestRoute from './components/guest-route.component'
import ProtectedRoute from './components/protected-route.component'
import Documents from './pages/documents.page'
import Home from './pages/home.page'
import Login from './pages/login.page'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/login',
            element: <Login />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/documents',
            element: <Documents />,
          },
        ],
      },
    ],
  },
])

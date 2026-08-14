import { createBrowserRouter } from 'react-router-dom'

import Home from './pages/home.page'
import Login from './pages/login.page'
import Documents from './pages/documents.page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/documents',
    element: <Documents />,
  },
])
import { Outlet } from 'react-router-dom'

import Navbar from './navbar.component'

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

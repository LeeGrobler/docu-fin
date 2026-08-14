import { RouterProvider } from 'react-router-dom'

import './App.css'
import { router } from './router'
import Navbar from './components/navbar.component'

function App() {
  return <>
    <Navbar />
    <main>
      <RouterProvider router={router} />
    </main>
  </>
}

export default App

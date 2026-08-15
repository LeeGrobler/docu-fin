import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar } from '@mui/material';

import logo from '../assets/docufin-logo.webp'
import { useAuth } from '../context/auth.context'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component={RouterLink}
          to={isAuthenticated ? '/documents' : '/'}
          sx={{
            display: 'flex',
            mr: 4,
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="DocuFin"
            sx={{
              height: 40,
              width: 'auto',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAuthenticated ? (
            <Button component={RouterLink} color="inherit" to="/documents">Documents</Button>
          ) : (
            <Button component={RouterLink} color="inherit" to="/">Home</Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          {isAuthenticated ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button component={RouterLink} color="inherit" to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

import { AppBar, Box, Button, Toolbar } from '@mui/material';

import logo from '../assets/docufin-logo.webp'

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component="img"
          src={logo}
          alt="DocuFin"
          sx={{
            height: 40,
            width: 'auto',
            mr: 4,
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Documents</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button color="inherit">Login</Button>
          <Button color="inherit">Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

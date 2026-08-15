import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

import logo from '../assets/docufin-logo.webp'

export default function Home() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        background: 'linear-gradient(135deg, #17241d 0%, #234634 54%, #d5b46a 100%)',
        color: 'common.white',
        display: 'flex',
        minHeight: 'calc(100vh - 4rem)',
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ maxWidth: 620 }}>
          <Box component="img" src={logo} alt="DocuFin" sx={{ height: 38, mb: 5, width: 'auto' }} />

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 42, md: 64 },
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1.02,
              mb: 3,
            }}
          >
            Tenant-safe document workspaces for accounting teams.
          </Typography>

          <Typography sx={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: 18, lineHeight: 1.7, mb: 4 }}>
            Sign in to manage client document metadata, search by title, and move records through a focused approval status flow.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              to="/login"
              size="large"
              variant="contained"
              sx={{
                bgcolor: '#f2c75f',
                color: '#17241d',
                fontWeight: 800,
                px: 3,
                textTransform: 'none',
                '&:hover': { bgcolor: '#ddb14c' },
              }}
            >
              Sign in
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

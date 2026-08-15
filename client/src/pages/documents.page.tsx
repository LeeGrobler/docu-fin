import { useCallback, useEffect, useState } from 'react'
import type * as React from 'react'

import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

import {
  DOCUMENT_STATUSES,
  listDocumentsRequest,
  updateDocumentStatusRequest,
  type Document,
  type DocumentStatus,
} from '../api/client'
import { useAuth } from '../context/auth.context'

function getStatusLabel(status: DocumentStatus) {
  return status.replaceAll('_', ' ')
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [updatingDocumentId, setUpdatingDocumentId] = useState<string | null>(null)
  const { token, logout } = useAuth()

  const loadDocuments = useCallback(async (searchText = '') => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await listDocumentsRequest(token, searchText.trim() || undefined)
      setDocuments(response.documents)
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized.') {
        logout()
      }

      setError(error instanceof Error ? error.message : 'Could not load documents.')
    } finally {
      setIsLoading(false)
    }
  }, [logout, token])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await loadDocuments(search)
  }

  const handleStatusChange = async (documentId: string, status: DocumentStatus) => {
    setError(null)
    setUpdatingDocumentId(documentId)

    try {
      const response = await updateDocumentStatusRequest(token, documentId, status)
      setDocuments((currentDocuments) =>
        currentDocuments.map((document) => document.id === documentId ? response.document : document)
      )
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized.') {
        logout()
      }

      setError(error instanceof Error ? error.message : 'Could not update document.')
    } finally {
      setUpdatingDocumentId(null)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" sx={{ fontSize: 32, fontWeight: 800, mb: 1 }}>
            Documents
          </Typography>
          <Typography color="text.secondary">
            Review tenant documents and update their approval status.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSearch}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Search by title"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={isLoading} sx={{ minWidth: 120, textTransform: 'none' }}>
              Search
            </Button>
          </Stack>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Identifier</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.identifier}</TableCell>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={document.status}
                      disabled={updatingDocumentId === document.id}
                      onChange={(event) => void handleStatusChange(document.id, event.target.value as DocumentStatus)}
                      sx={{ minWidth: 190 }}
                    >
                      {DOCUMENT_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>{new Date(document.updatedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}

              {!documents.length && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      {isLoading ? 'Loading documents...' : 'No documents found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  )
}

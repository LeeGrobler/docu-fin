import { Router } from 'express';

import { documentService } from '../services/document.service';
import { HttpError } from '../utils/HttpError';
import { isDocumentStatus } from "../types/Document";

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tenantId = req.auth?.tenantId
    if (!tenantId) throw new HttpError(400, 'Invalid tenant.')

    const search = req.query.search
    if (typeof search !== 'undefined' && typeof search !== 'string') {
      throw new HttpError(400, 'Search must be a string.')
    }

    const documents = await documentService.listDocumentsByTenantId(tenantId, search?.trim() || undefined)
    res.status(200).json({ documents, message: 'Documents retrieved.' });
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

router.patch('/:documentId/status', async (req, res, next) => {
  try {
    const tenantId = req.auth?.tenantId
    if (!tenantId) throw new HttpError(400, 'Invalid tenant.')

    const documentId = req.params.documentId
    const status = req.body.status

    if (
      typeof documentId !== 'string' ||
      !isDocumentStatus(status) ||
      !documentId
    ) {
      throw new HttpError(400, 'Enter a valid document id and status.')
    }

    const document = await documentService.updateDocumentStatus(tenantId, documentId, status)
    if (!document) throw new HttpError(404, 'Document not found.')

    res.status(200).json({ document, message: 'Document updated.' });
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
})

export default router;

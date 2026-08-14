import { Router } from 'express';

import { documentService } from '../services/document.service';
import { HttpError } from '../utils/HttpError';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tenantId = req.auth?.tenantId
    if (!tenantId) throw new HttpError(400, 'Invalid tenant.')

    const documents = await documentService.listDocumentsByTenantId(tenantId)
    res.status(200).json({ documents, message: 'Documents retrieved.' });
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

export default router;

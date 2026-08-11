import { Router } from 'express';

import { placeholderService } from '../services/placeholder.service';

const router = Router();

router.get('/', (_req, res, next) => {
  try {
    placeholderService.todo();
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
});

export default router;

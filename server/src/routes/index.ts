import { Router } from 'express';

import loginRoutes from './login.routes';
import documentRoutes from './document.routes';
import { authHandler } from '../middleware/authHandler';

const router = Router();

router.use('/login', loginRoutes);
router.use('/document', authHandler, documentRoutes);

export default router;

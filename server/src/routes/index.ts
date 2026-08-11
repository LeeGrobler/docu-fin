import { Router } from 'express';

import placeholderRoutes from './placeholder.routes';

const router = Router();

router.use('/placeholder', placeholderRoutes);

export default router;

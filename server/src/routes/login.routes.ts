import { Router } from 'express';

import { loginService } from '../services/login.service';
import { HttpError } from '../utils/HttpError';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
      throw new HttpError(400, 'Please enter an email address and password.')
    }

    const token = await loginService.login(email, password);
    res.status(200).json({ token, message: 'Login successful.' });
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

export default router;

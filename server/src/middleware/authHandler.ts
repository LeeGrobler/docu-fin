import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { HttpError } from '../utils/HttpError';
import { config } from '../config';

interface AuthTokenPayload extends JwtPayload {
  user_id: string;
  user_email: string;
  tenant_id: string;
}

export const authHandler: RequestHandler = (req, _res, next) => {
  const auth = req.headers.authorization
  if (!auth) throw new HttpError(401, 'Unauthorized.')

  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new HttpError(401, 'Unauthorized.')

  try {
    const token = match[1]
    const decoded = jwt.verify(token, config.jwtSecret) as AuthTokenPayload

    req.auth = {
      userId: decoded.user_id,
      userEmail: decoded.user_email,
      tenantId: decoded.tenant_id
    }

    next()
  } catch (error) {
    console.error('error: ', error);
    throw new HttpError(401, 'Unauthorized.')
  }
};

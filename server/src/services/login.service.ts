import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'

import { pool } from "../db";
import { config } from '../config';
import { HttpError } from '../utils/HttpError';

type LoginUser = {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
};

async function getUser(email: string) {
  const user = await pool.query<LoginUser>(
    `
      SELECT id, tenant_id, email, password_hash
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  )
  if (!user?.rowCount || user.rowCount < 1) {
    throw new HttpError(401, 'Incorrect email or password.')
  }

  return user.rows[0]
}

async function checkPassword(password: string, hash: string) {
  const match = await bcrypt.compare(password, hash)
  if (!match) {
    throw new HttpError(401, 'Incorrect email or password.')
  }
}

function generateJwt({ id, email, tenant_id }: LoginUser) {
  return jwt.sign({
    user_id: id,
    user_email: email,
    tenant_id
  }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn']
  })
}

export const loginService = {
  login: async (email: string, password: string) => {
    const user = await getUser(email)
    await checkPassword(password, user.password_hash)
    return generateJwt(user)
  }
};

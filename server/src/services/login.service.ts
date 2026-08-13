import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'

import { pool } from "../db";
import { config } from '../config';
import { HttpError } from '../utils/HttpError';

async function getUser(email: string) {
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  if (!user?.rowCount || user.rowCount < 1) {
    throw new HttpError(401, 'Incorrect email or password.')
  }

  return user
}

async function checkPassword(password: string, hash: string) {
  const match = await bcrypt.compare(password, hash)
  if (!match) {
    throw new HttpError(401, 'Incorrect email or password.')
  }
}

function generateJwt(id: string, email: string, tenant_id: string) { // TODO: update this with proper types once generated from supabase
  return jwt.sign({ id, email, tenant_id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn']
  })
}

export const loginService = {
  login: async (email: string, password: string) => {
    const user = await getUser(email)
    await checkPassword(password, user.rows[0].password_hash)
    return generateJwt(user.rows[0].id, user.rows[0].email, user.rows[0].tenant_id) // TODO: here too
  }
};

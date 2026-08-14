import fs from "node:fs";
import path from "node:path";
import bcrypt from 'bcrypt'

import { pool } from "./pool";
import { config } from '../config';

const init = async () => {
  const saltRounds = Number(config.bcryptSaltRounds)
  const passwordHash = await bcrypt.hash('Password123!', saltRounds)

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8").replace('<hash_goes_here>', passwordHash);

  await pool.query(schema);
  await pool.query(seed);
};

init();

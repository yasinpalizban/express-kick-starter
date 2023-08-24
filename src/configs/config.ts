import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  SECRET_KEY,
  SECRET_NAME,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  DB_Pool_Max,
  DB_Pool_Min,
  SITE_ADDRESS,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROMEMAIL,
  PASSWORD_KEY,
} = process.env;

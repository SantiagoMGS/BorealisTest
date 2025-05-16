import 'dotenv/config';
import path from 'node:path';
import { PrismaConfig } from 'prisma';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

process.env.DATABASE_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default {
  earlyAccess: true,
  schema: path.join('prisma'),
} satisfies PrismaConfig;

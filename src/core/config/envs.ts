import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  JWT_EXPIRATION: string;
  JWT_SECRET: string;
  MAX_ACTIVE_SESSIONS: number;
  DATABASE_URL: string;
  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_HOST?: string;
  DB_PORT?: number;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    JWT_REFRESH_SECRET: joi.string().default('borealis_dev_refresh'),
    JWT_REFRESH_EXPIRATION: joi.string().default('604800'),
    JWT_EXPIRATION: joi.string().default('8h'),
    JWT_SECRET: joi.string().default('borealis_dev'),
    DATABASE_URL: joi
      .string()
      .default('postgresql://postgres:postgres@localhost:5432/borealis_dev_db'),
    DB_NAME: joi.string().optional(),
    DB_USER: joi.string().optional(),
    DB_PASSWORD: joi.string().optional(),
    DB_HOST: joi.string().optional(),
    DB_PORT: joi.number().optional(),
    MAX_ACTIVE_SESSIONS: joi.number().default(1),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtRefreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
  jwtExpiration: envVars.JWT_EXPIRATION,
  jwtSecret: envVars.JWT_SECRET,
  databaseUrl: envVars.DATABASE_URL,
  dbName: envVars.DB_NAME,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  maxActiveSessions: envVars.MAX_ACTIVE_SESSIONS,
};

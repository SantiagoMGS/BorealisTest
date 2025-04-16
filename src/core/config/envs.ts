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
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_REFRESH_EXPIRATION: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    MAX_ACTIVE_SESSIONS: joi.number().required(),
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

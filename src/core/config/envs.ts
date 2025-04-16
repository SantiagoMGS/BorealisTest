import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  JWT_EXPIRATION: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
  MAX_ACTIVE_SESSIONS: number;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_REFRESH_EXPIRATION: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    DATABASE_URL: joi.string().required(),
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
  maxActiveSessions: envVars.MAX_ACTIVE_SESSIONS,
};

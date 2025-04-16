import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_NAME: string;
  DB_PASSWORD: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbName: envVars.DB_NAME,
  dbPassword: envVars.DB_PASSWORD,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
};

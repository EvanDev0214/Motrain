import z from 'zod';

const requiredEnvField = () => z
  .string()
  .min(1, 'environment variable is required but missing or empty');

const numericEnvField = () => requiredEnvField()
  .regex(/^\d+$/, 'must be a positive integer')
  .transform(val => Number(val))
  .pipe(z.number().int().positive());

export const envSchema = z.object({
  DATABASE_URL: requiredEnvField(),
  PORT: numericEnvField(),
  HOST: requiredEnvField(),
  NODE_ENV: z.enum(['production', 'development'], 'Must be "production" or "development"'),
  CORS_ORIGIN: requiredEnvField(),
  RESEND_API_KEY: requiredEnvField(),
  RESEND_FROM: requiredEnvField(),
  RESEND_OTP_EXPIRES_MINUTES: numericEnvField(),
  MAX_OTP_ATTEMPTS: numericEnvField()
});

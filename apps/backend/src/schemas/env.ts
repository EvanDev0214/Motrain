import z from 'zod';
import ms, { type StringValue } from 'ms';

const requiredEnvField = () => z
  .string()
  .min(1, 'environment variable is required but missing or empty');

const numericEnvField = () => requiredEnvField()
  .regex(/^\d+$/, 'must be a positive integer')
  .transform(val => Number(val))
  .pipe(z.number().int().positive());

const msDurationField = () => requiredEnvField()
  .refine(
    val => ms(val as StringValue) !== undefined,
    'must be a valid ms duration (e.g., "7d", "1h", "30m")'
  );

export const envSchema = z.object({
  DATABASE_URL: requiredEnvField(),
  PORT: numericEnvField(),
  HOST: requiredEnvField(),
  NODE_ENV: z.enum(['production', 'development'], 'Must be "production" or "development"'),
  CORS_ORIGIN: requiredEnvField(),
  RESEND_API_KEY: requiredEnvField(),
  RESEND_FROM: requiredEnvField(),
  RESEND_OTP_EXPIRES_MINUTES: numericEnvField(),
  MAX_OTP_ATTEMPTS: numericEnvField(),
  SWAGGER_USER: z.string().optional(),
  SWAGGER_PASSWORD: z.string().optional(),
  JWT_ACCESS_SECRET_KEY: requiredEnvField(),
  JWT_REFRESH_SECRET_KEY: requiredEnvField(),
  JWT_ACCESS_EXPIRES_IN: msDurationField(),
  JWT_REFRESH_EXPIRES_IN: msDurationField(),
  JWT_ISS: requiredEnvField()
});

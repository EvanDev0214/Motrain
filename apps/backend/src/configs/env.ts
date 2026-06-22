import 'dotenv/config';
import { envSchema } from '@/schemas/env';

const result = envSchema.safeParse(process.env);

if (!result.success) {
  // eslint-disable-next-line no-console
  console.error('Environment variable validation failed');
  for (const issue of result.error.issues) {
    // eslint-disable-next-line no-console
    console.error(`${issue.path}: ${issue.message}`);
  }
  process.exit(1);
}

const env = result.data;
export default env;

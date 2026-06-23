import jwt from 'jsonwebtoken';
import type ms from 'ms';
import env from '@/configs/env';

export const generateJwt = (
  type: 'ACCESS' | 'REFRESH',
  payload: {
    email: Email,
    userId: UUID
  }
) => {
  const token = jwt.sign(payload, env[`JWT_${type}_SECRET_KEY`], {
    algorithm: 'HS256',
    expiresIn: env[`JWT_${type}_EXPIRES_IN`] as ms.StringValue,
    issuer: env.JWT_ISS
  });

  return token;
};

import jwt from 'jsonwebtoken';
import { type StringValue } from 'ms';
import env from '@/configs/env';

export const generateJwt = (
  type: 'ACCESS' | 'REFRESH' | 'PASSWORD_RESET',
  payload: UserJwtData
) => {
  const token = jwt.sign(payload, env[`JWT_${type}_SECRET_KEY`], {
    algorithm: 'HS256',
    expiresIn: env[`JWT_${type}_EXPIRES_IN`] as StringValue,
    issuer: env.JWT_ISS
  });

  return token;
};

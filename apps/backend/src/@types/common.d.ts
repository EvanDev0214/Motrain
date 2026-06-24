import jwt from 'jsonwebtoken';

declare global {
  /**
   * @example 'user@example.com'
   */
  type Email = string;

  /**
   * @example 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
   */
  type UUID = string;

  /** JWT payload 中自定義的使用者資料 */
  type UserJwtData = {
    email: Email;
    userId: UUID;
  };

  /** 完整的 JWT payload，包含 jsonwebtoken 標準欄位與使用者資料 */
  type UserJwtPayload = jwt.JwtPayload & UserJwtData;
}

export {};

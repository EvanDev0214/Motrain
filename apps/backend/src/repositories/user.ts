import type { RegisterInput } from '@/schemas/auth';
import { db } from '@/db/db';
import { users } from '@/db/schemas/users';

type CreateUserData = Omit<RegisterInput, 'password'> & {
  passwordHash: string
};

export const userRepository = {
  create: async (data: CreateUserData) => {
    const [newUser] = await db.insert(users).values({
      nickname: data.nickname,
      email: data.email,
      passwordHash: data.passwordHash
    }).returning({
      id: users.id,
      nickname: users.nickname,
      email: users.email,
      createdAt: users.createdAt
    });

    return newUser!;
  }
};

export type UserRepository = typeof userRepository;

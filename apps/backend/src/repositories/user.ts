import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { users } from '@/db/schemas/users';
import type { RegisterInput } from '@/schemas/auth';

type UpdateUserData = Partial<Pick<typeof users.$inferInsert, 'nickname' | 'avatarUrl' | 'weightUnit'>>;
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
  },
  markEmailAsVerified: async (userId: UUID) => {
    await db.update(users).set({
      emailVerifiedAt: new Date()
    }).where(eq(users.id, userId));
  },
  findByEmail: async (email: Email) => {
    const result = await db.select().from(users)
      .where(eq(users.email, email));

    return result[0];
  },
  findById: async (userId: UUID) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    return user ?? null;
  },
  updatePasswordByUserId: async (userId: UUID, passwordHash: string) => {
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));
  },
  updateUserById: async (userId: UUID, data: UpdateUserData) => {
    return await db.update(users)
      .set(data)
      .where(eq(users.id, userId));
  }
};

export type UserRepo = typeof userRepository;

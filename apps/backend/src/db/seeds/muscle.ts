import { db } from '@/db/db';
import { muscles } from '@/db/schemas/muscles';
import { logger } from '@/utils/logger';

const muscleData = [
  // 胸部
  { name: '胸大肌' },
  // 背部
  { name: '背闊肌' },
  { name: '斜方肌' },
  { name: '菱形肌' },
  // 肩部
  { name: '三角肌前束' },
  { name: '三角肌中束' },
  { name: '三角肌後束' },
  // 手臂
  { name: '肱二頭肌' },
  { name: '肱三頭肌' },
  // 腹部
  { name: '腹直肌' },
  { name: '腹斜肌' },
  // 下肢
  { name: '股四頭肌' },
  { name: '腿後肌' },
  { name: '臀大肌' },
  { name: '小腿肌' }
];

async function seedMuscles() {
  await db.insert(muscles).values(muscleData).onConflictDoNothing();
  logger.info('✅ Muscles seeded');
}

seedMuscles()
  .catch((err) => {
    logger.error(err);
    process.exitCode = 1;
  })
  .finally(() => process.exit());

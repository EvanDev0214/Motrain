import { db } from '@/db/db';
import { exercises } from '@/db/schemas/exercises';
import { exerciseMuscles } from '@/db/schemas/exerciseMuscles';
import type { CreateUserExerciseBody } from '@/schemas/exercise';
import { logger } from '@/utils/logger';

type SystemExerciseData = CreateUserExerciseBody & {
  userId: null;
  isSystem: boolean;
};

const USER_ID = null;

const systemExerciseData: SystemExerciseData[] = [
  {
    name: '槓鈴臥推',
    equipment: 'barbell',
    userId: USER_ID,
    isSystem: true,
    defaultWeightMode: 'single',
    mediaUrl: null,
    muscles: [
      { muscleId: '86f7af32-3d60-4c97-9f16-96cf9821583b', muscleRole: 'primary' },
      { muscleId: 'dc95d104-dda3-47c8-b61e-c61ebf6078ce', muscleRole: 'secondary' },
      { muscleId: 'b27af6ef-79e0-4dd6-ad32-9df87fe21428', muscleRole: 'secondary' }
    ]
  },
  {
    name: '槓鈴深蹲',
    equipment: 'barbell',
    userId: USER_ID,
    isSystem: true,
    defaultWeightMode: 'single',
    mediaUrl: null,
    muscles: [
      { muscleId: 'a25d9c10-688b-4b40-842e-5c49781256b8', muscleRole: 'primary' },
      { muscleId: '11eef77d-31f5-42f5-95a2-f47620c5cfda', muscleRole: 'secondary' },
      { muscleId: 'a8ff526f-d407-4f30-9ad9-1f69e4899d05', muscleRole: 'secondary' }
    ]
  },
  {
    name: '啞鈴側飛鳥',
    equipment: 'dumbbell',
    userId: USER_ID,
    isSystem: true,
    defaultWeightMode: 'bilateral',
    mediaUrl: null,
    muscles: [
      { muscleId: 'b6daf567-eba1-4ccb-8b8c-4c19faff9dca', muscleRole: 'primary' },
      { muscleId: 'b27af6ef-79e0-4dd6-ad32-9df87fe21428', muscleRole: 'secondary' }
    ]
  },
  {
    name: '鐵桿二頭彎舉',
    equipment: 'cable',
    userId: USER_ID,
    isSystem: true,
    defaultWeightMode: 'single',
    mediaUrl: null,
    muscles: [
      { muscleId: 'cae9eeb9-d053-4db0-b526-46a64777f2c0', muscleRole: 'primary' }
    ]
  },
  {
    name: '史密斯上胸推舉',
    equipment: 'smith_machine',
    userId: USER_ID,
    isSystem: true,
    defaultWeightMode: 'single',
    mediaUrl: null,
    muscles: [
      { muscleId: '86f7af32-3d60-4c97-9f16-96cf9821583b', muscleRole: 'primary' },
      { muscleId: 'b27af6ef-79e0-4dd6-ad32-9df87fe21428', muscleRole: 'secondary' },
      { muscleId: 'dc95d104-dda3-47c8-b61e-c61ebf6078ce', muscleRole: 'secondary' }
    ]
  },
  {
    name: '滑輪寬距下拉',
    equipment: 'cable',
    userId: USER_ID,
    isSystem: true,
    defaultWeightMode: 'single',
    mediaUrl: null,
    muscles: [
      { muscleId: '4de25db3-4c70-48af-9673-c35ea9111b2f', muscleRole: 'primary' },
      { muscleId: '5cd9b1b0-beba-400e-8ba0-cfa0adc5dcbc', muscleRole: 'primary' },
      { muscleId: '2d6f49f1-117c-4f63-864e-9aefe4fd7fe3', muscleRole: 'secondary' },
      { muscleId: 'cae9eeb9-d053-4db0-b526-46a64777f2c0', muscleRole: 'secondary' }
    ]
  }
];

async function seedSystemExercises() {
  await Promise.all(
    systemExerciseData.map(async (exercise) => {
      await db.transaction(async (tx) => {
        const [exerciseRecord] = await tx.insert(exercises).values({
          name: exercise.name,
          equipment: exercise.equipment,
          userId: exercise.userId,
          isSystem: exercise.isSystem,
          defaultWeightMode: exercise.defaultWeightMode,
          mediaUrl: exercise.mediaUrl
        }).onConflictDoNothing().returning({ id: exercises.id });

        if (!exerciseRecord) {
          logger.info(`⚠️ System exercise "${exercise.name}" already exists, skipping...`);
          return;
        }

        if (exercise.muscles.length > 0) {
          await tx.insert(exerciseMuscles).values(
            exercise.muscles.map((m) => ({
              exerciseId: exerciseRecord.id,
              muscleId: m.muscleId,
              muscleRole: m.muscleRole
            }))
          );
        }
      });

    })
  );
  logger.info('✅ System exercises seeded');
}

seedSystemExercises()
  .catch(err => {
    logger.error(err);
    process.exitCode = 1;
  })
  .finally(() => process.exit());

import { workoutRepository, type WorkoutRepo } from '@/repositories/workout';
import type { CreateUserWorkoutBody } from '@/schemas/workout';
import { NotFound404Error } from '@/utils/error';

export class WorkoutService {
  constructor(
    private workoutRepository: WorkoutRepo
  ) {}

  // TODO: 這個命名有問題
  async getWorkoutsByUserId(userId: UUID) {
    return await this.workoutRepository.findByUserId(userId);
  }

  async getWorkoutDetails(userId: UUID, workoutId: UUID) {
    const workout = await this.workoutRepository.findOneById(workoutId);

    if (!workout) {
      throw new NotFound404Error('The workout does not exist or has been deleted.', 'WORKOUT_NOT_FOUND');
    }

    if (workout.userId !== userId) {
      throw new NotFound404Error('The workout does not exist or has been deleted.', 'WORKOUT_NOT_FOUND');
    }

    return workout;
  }

  async createUserWorkout(userId: UUID, data: CreateUserWorkoutBody) {
    const workout = await this.workoutRepository.create({ userId, ...data });

    if (!workout) {
      throw new Error('Failed to create workout.');
    }

    return workout;
  }
}

export const workoutService = new WorkoutService(workoutRepository);

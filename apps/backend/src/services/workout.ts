import { workoutRepository, type WorkoutRepo } from '@/repositories/workout';
import type { CreateUserWorkoutBody } from '@/schemas/workout';

export class WorkoutService {
  constructor(
    private workoutRepository: WorkoutRepo
  ) {}

  async createUserWorkout(userId: UUID, data: CreateUserWorkoutBody) {
    const workout = await this.workoutRepository.create({ userId, ...data });

    if (!workout) {
      throw new Error('Failed to create workout.');
    }

    return workout;
  }
}

export const workoutService = new WorkoutService(workoutRepository);

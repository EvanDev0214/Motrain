import type { sets } from '@/db/schemas';

type Set = typeof sets.$inferSelect;

export type ExerciseHistorySet = Pick<Set,
  'setType' |
  'weight' |
  'weightLeft' |
  'weightRight' |
  'reps' |
  'rpe' |
  'restSeconds' |
  'note'
> & {
  setOrder: Set['order'];
};

export type ExerciseHistoryRecord = {
  workoutId: UUID;
  workoutName: string;
  workoutDate: Date;
  sets: ExerciseHistorySet[];
};

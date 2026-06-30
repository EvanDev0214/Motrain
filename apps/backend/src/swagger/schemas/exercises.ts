export const getExercisesSchema: SwaggerSchema = {
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              example: '550e8400-e29b-41d4-a716-446655440001'
            },
            isSystem: {
              type: 'boolean',
              example: false
            },
            name: {
              type: 'string',
              example: 'Bench Press'
            },
            equipment: {
              type: 'string',
              enum: [
                'barbell',
                'dumbbell',
                'cable',
                'smith_machine',
                'machine',
                'plate_loaded_machine',
                'kettlebell',
                'bodyweight',
                'other'
              ],
              example: 'barbell'
            },
            defaultWeightMode: {
              type: 'string',
              enum: ['single', 'bilateral'],
              example: 'single'
            },
            mediaUrl: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/exercises/bench-press.mp4'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-22T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-22T00:00:00.000Z'
            }
          }
        }
      }
    }
  }
};

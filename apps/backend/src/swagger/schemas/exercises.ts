const musclesProperty = {
  type: 'array' as const,
  items: {
    type: 'object' as const,
    properties: {
      muscleId: {
        type: 'string' as const,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440010'
      },
      muscleRole: {
        type: 'string' as const,
        enum: ['primary', 'secondary'],
        example: 'primary'
      }
    }
  }
};

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
            },
            muscles: musclesProperty
          }
        }
      }
    }
  }
};

export const createUserExerciseSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['name', 'equipment', 'defaultWeightMode', 'mediaUrl', 'muscles'],
    properties: {
      name: {
        type: 'string',
        example: 'Incline Dumbbell Press'
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
        example: 'dumbbell'
      },
      defaultWeightMode: {
        type: 'string',
        enum: ['single', 'bilateral'],
        example: 'bilateral'
      },
      mediaUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/exercises/incline-dumbbell-press.mp4'
      },
      muscles: musclesProperty
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
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
            example: '550e8400-e29b-41d4-a716-446655440001'
          },
          isSystem: {
            type: 'boolean',
            example: false
          },
          name: {
            type: 'string',
            example: 'Incline Dumbbell Press'
          },
          equipment: {
            type: 'string',
            example: 'dumbbell'
          },
          defaultWeightMode: {
            type: 'string',
            example: 'bilateral'
          },
          mediaUrl: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/exercises/incline-dumbbell-press.mp4'
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
};

export const getExerciseSchema: SwaggerSchema = {
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
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
          },
          muscles: musclesProperty
        }
      }
    }
  }
};

const exerciseHistorySetProperty = {
  type: 'object' as const,
  properties: {
    setOrder: {
      type: 'integer' as const,
      example: 1
    },
    setType: {
      type: 'string' as const,
      enum: ['warmup', 'formal', 'decrease', 'superset'],
      example: 'formal'
    },
    weight: {
      type: 'string' as const,
      nullable: true,
      example: '80.5'
    },
    weightLeft: {
      type: 'string' as const,
      nullable: true,
      example: null
    },
    weightRight: {
      type: 'string' as const,
      nullable: true,
      example: null
    },
    reps: {
      type: 'integer' as const,
      nullable: true,
      example: 10
    },
    rpe: {
      type: 'string' as const,
      enum: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
      nullable: true,
      example: '8'
    },
    restSeconds: {
      type: 'integer' as const,
      nullable: true,
      example: 90
    },
    note: {
      type: 'string' as const,
      nullable: true,
      example: null
    }
  }
};

export const getExerciseHistorySchema: SwaggerSchema = {
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
            workoutId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            workoutName: {
              type: 'string',
              example: 'Push Day'
            },
            workoutDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-22T00:00:00.000Z'
            },
            sets: {
              type: 'array',
              items: exerciseHistorySetProperty
            }
          }
        }
      }
    }
  }
};

export const replaceExerciseSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['name', 'equipment', 'defaultWeightMode', 'mediaUrl', 'muscles'],
    properties: {
      name: {
        type: 'string',
        example: 'Incline Dumbbell Press'
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
        example: 'dumbbell'
      },
      defaultWeightMode: {
        type: 'string',
        enum: ['single', 'bilateral'],
        example: 'bilateral'
      },
      mediaUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/exercises/incline-dumbbell-press.mp4'
      },
      muscles: musclesProperty
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
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
            example: '550e8400-e29b-41d4-a716-446655440001'
          },
          isSystem: {
            type: 'boolean',
            example: false
          },
          name: {
            type: 'string',
            example: 'Incline Dumbbell Press'
          },
          equipment: {
            type: 'string',
            example: 'dumbbell'
          },
          defaultWeightMode: {
            type: 'string',
            example: 'bilateral'
          },
          mediaUrl: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/exercises/incline-dumbbell-press.mp4'
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
};

const setProperty = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'string' as const,
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440020'
    },
    workoutExerciseId: {
      type: 'string' as const,
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440010'
    },
    order: {
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
    note: {
      type: 'string' as const,
      nullable: true,
      example: null
    },
    restSeconds: {
      type: 'integer' as const,
      nullable: true,
      example: 90
    }
  }
};

const workoutExerciseProperty = {
  type: 'array' as const,
  items: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string' as const,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440010'
      },
      workoutId: {
        type: 'string' as const,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000'
      },
      exerciseId: {
        type: 'string' as const,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440002'
      },
      supersetId: {
        type: 'string' as const,
        format: 'uuid',
        nullable: true,
        example: null
      },
      order: {
        type: 'integer' as const,
        example: 1
      },
      exercise: {
        type: 'object' as const,
        properties: {
          id: {
            type: 'string' as const,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440002'
          },
          userId: {
            type: 'string' as const,
            format: 'uuid',
            nullable: true,
            example: null
          },
          isSystem: {
            type: 'boolean' as const,
            example: true
          },
          name: {
            type: 'string' as const,
            example: 'Bench Press'
          },
          equipment: {
            type: 'string' as const,
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
            type: 'string' as const,
            enum: ['single', 'bilateral'],
            example: 'single'
          },
          mediaUrl: {
            type: 'string' as const,
            nullable: true,
            example: 'https://example.com/exercises/bench-press.mp4'
          },
          createdAt: {
            type: 'string' as const,
            format: 'date-time',
            example: '2026-06-22T00:00:00.000Z'
          },
          updatedAt: {
            type: 'string' as const,
            format: 'date-time',
            example: '2026-06-22T00:00:00.000Z'
          }
        }
      },
      sets: {
        type: 'array' as const,
        items: setProperty
      }
    }
  }
};

export const getWorkoutsSchema: SwaggerSchema = {
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
            name: {
              type: 'string',
              example: 'Push Day'
            },
            createdAt: {
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

export const createUserWorkoutSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['name', 'reflections'],
    properties: {
      name: {
        type: 'string',
        example: 'Push Day'
      },
      reflections: {
        type: 'string',
        nullable: true,
        example: 'Felt strong on bench press today.'
      }
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
          name: {
            type: 'string',
            example: 'Push Day'
          },
          reflections: {
            type: 'string',
            nullable: true,
            example: 'Felt strong on bench press today.'
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

export const getWorkoutSchema: SwaggerSchema = {
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
          name: {
            type: 'string',
            example: 'Push Day'
          },
          reflections: {
            type: 'string',
            nullable: true,
            example: 'Felt strong on bench press today.'
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
          workoutExercises: workoutExerciseProperty
        }
      }
    }
  }
};

const workoutExercisesRequestProperty = {
  type: 'object' as const,
  required: ['exercises'],
  properties: {
    exercises: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        required: ['exerciseId', 'order', 'supersetId', 'sets'],
        properties: {
          exerciseId: {
            type: 'string' as const,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440002'
          },
          order: {
            type: 'integer' as const,
            example: 1
          },
          supersetId: {
            type: 'string' as const,
            format: 'uuid',
            nullable: true,
            example: null
          },
          sets: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              required: ['setType', 'order', 'weight', 'weightLeft', 'weightRight', 'reps', 'rpe', 'note', 'restSeconds'],
              properties: {
                setType: {
                  type: 'string' as const,
                  enum: ['warmup', 'formal', 'decrease', 'superset'],
                  example: 'formal'
                },
                order: {
                  type: 'integer' as const,
                  example: 1
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
                note: {
                  type: 'string' as const,
                  nullable: true,
                  example: null
                },
                restSeconds: {
                  type: 'integer' as const,
                  nullable: true,
                  example: 90
                }
              }
            }
          }
        }
      }
    }
  }
};

const workoutWithExercisesResponseProperty = {
  type: 'object' as const,
  properties: {
    status: {
      type: 'string' as const,
      example: 'success'
    },
    data: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000'
        },
        userId: {
          type: 'string' as const,
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440001'
        },
        name: {
          type: 'string' as const,
          example: 'Push Day'
        },
        reflections: {
          type: 'string' as const,
          nullable: true,
          example: 'Felt strong on bench press today.'
        },
        createdAt: {
          type: 'string' as const,
          format: 'date-time',
          example: '2026-06-22T00:00:00.000Z'
        },
        updatedAt: {
          type: 'string' as const,
          format: 'date-time',
          example: '2026-06-22T00:00:00.000Z'
        },
        workoutExercises: workoutExerciseProperty
      }
    }
  }
};

export const createUserWorkoutExercisesSchema: SwaggerSchema = {
  request: workoutExercisesRequestProperty,
  response: workoutWithExercisesResponseProperty
};

export const replaceUserWorkoutExercisesSchema: SwaggerSchema = {
  request: workoutExercisesRequestProperty,
  response: workoutWithExercisesResponseProperty
};

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
          }
        }
      }
    }
  }
};

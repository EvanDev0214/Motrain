const bodyWeightItemProperties = {
  id: {
    type: 'string' as const,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000'
  },
  weight: {
    type: 'string' as const,
    example: '70.50'
  },
  recordedAt: {
    type: 'string' as const,
    format: 'date-time',
    example: '2026-06-22T00:00:00.000Z'
  }
};

export const getUserBodyWeightsSchema: SwaggerSchema = {
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
          properties: bodyWeightItemProperties
        }
      }
    }
  }
};

export const createUserBodyWeightSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['weight', 'recordedAt'],
    properties: {
      weight: {
        type: 'string',
        pattern: '^\\d{1,4}(\\.\\d{1,2})?$',
        example: '70.50'
      },
      recordedAt: {
        type: 'string',
        format: 'date-time',
        example: '2026-06-22T00:00:00.000Z'
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
        properties: bodyWeightItemProperties
      }
    }
  }
};

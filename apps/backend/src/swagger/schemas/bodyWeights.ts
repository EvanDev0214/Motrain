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
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            weight: {
              type: 'string',
              example: '70.50'
            },
            recordedAt: {
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

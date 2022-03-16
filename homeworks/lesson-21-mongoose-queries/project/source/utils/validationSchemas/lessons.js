export const validationLessonSchema = {
  id: '/Lesson',
  type: 'object',
  properties: {
    title: {'type': 'string'},
    description: {'type': 'string'},
    order: {
      'type': 'number',
      minimum: 1,
      maximum: 9999
    },
    availability: {
      type: 'array',
      "minItems": 1,
      items: { type: 'string' }
    },
    content: {
      type: 'object',
      properties: {
        videos: {
          type: 'array',
          "minItems": 1,
          items: {
            type: 'object',
            properties: {
              title: {'type': 'string'},
              order: {'type': 'number'},
              uri: {'type': 'string'},
            }
          }
        },
        keynotes: {
          type: 'array',
          "minItems": 1,
          items: {
            type: 'object',
            properties: {
              title: {'type': 'string'},
              order: {'type': 'number'},
              uri: {'type': 'string'},
            }
          }
        }
      }
    }
  },
  required: ['order', 'title', 'description', 'availability'],
  additionalProperties: false
};

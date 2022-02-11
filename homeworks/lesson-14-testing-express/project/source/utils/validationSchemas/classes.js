export const validationClassSchema = {
  id: '/Class',
  type: 'object',
  properties: {
    title: {'type': 'string'},
    description: {'type': 'string'},
    order: {'type': 'number'},
    duration: {
      type: 'object',
      properties: {
        started: {'type': 'string'},
        closed: {'type': 'string'}
      }
    },
  },
  // 'required': ['hash', 'title']
  required: ['order', 'title', 'duration'],
  additionalProperties: false
};
/*
  "user": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "select",
  "notes": "отличный студент"
 */
export const validationEnrollStudentsSchema = {
  type: 'object',
  properties: {
    user: {'type': 'string'},
    status: {'type': 'string'},
    notes: {'type': 'string'},
  },
  required: ['user', 'status'],
  additionalProperties: false
};

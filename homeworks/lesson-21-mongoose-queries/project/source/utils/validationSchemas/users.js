/*
    All schema
export const validationUserSchemaOutput = {
    id: '/User',
    type: 'object',
    properties: {
        name:   {
            type:       'object',
            properties: {
                first: {type: 'string'},
                last:  {type: 'string'},
            },
            required:   [ 'first', 'last' ],
        },
        emails: {
            type:  'array',
            items: {
                type:       'object',
                properties: {
                    email:   {type: 'string'},
                    primary: {type: 'boolean'}
                },
                required:   [ 'email' ],
            }
        },
        phones: {
            type:  'array',
            items: {
                type:       'object',
                properties: {
                    phone:   {type: 'string'},
                    primary: {type: 'boolean'}
                },
                required:   [ 'email' ],
            }
        },
        sex:    {type: 'string'},
        hash:   {type: 'string'},
        roles:  {
            type:  'array',
            items: {
                type:     'string',
                minItems: 1
            }
        },
        notes:    {'type': 'string'},
        disabled: {'type': 'boolean'},
        social:   {
            facebook: {'type': 'string'},
            linkedin: {'type': 'string'},
            github:   {'type': 'string'},
            skype:    {'type': 'string'},
        },
    },
    required: ['name', 'emails', 'phones', 'sex'],
    additionalProperties: false
};
 */

// export const validationUserSchema = {
//     id: '/User',
//     type: 'object',
//     properties: {
//         name: { type: 'string' },
//         email: { type: 'string' },
//         phone: { type: 'string' },
//         password: { type: 'string' },
//         sex: { type: 'string' },
//         role: {
//             type: 'array',
//             items: {
//                 type: 'string',
//                 minItems: 1
//             }
//         }
//     },
//     required: ['name', 'email', 'phone', 'password', 'sex'],
//     additionalProperties: false
// };

export const validationUserSchema = {
    id: '/User',
    type: 'object',
    properties: {
        name:   {
            type:       'object',
            properties: {
                first: {type: 'string'},
                last:  {type: 'string'},
            },
            required:   [ 'first', 'last' ],
        },
        email: { type: 'string' },
        phone: { type: 'string' },
        password: { type: 'string' },
        sex: { type: 'string' },
        role: {
            type: 'string',
        }
        // role: {
        //     type: 'array',
        //     items: {
        //         type: 'string',
        //         minItems: 1
        //     }
        // }
    },
    required: ['name', 'email', 'phone', 'password', 'sex'],
    additionalProperties: false
};


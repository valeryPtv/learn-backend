const { validate, validateFields } = require('./');

describe('Test validate function', () => {
  /**
   * @param {string} fieldName
   * @param {boolean} [addFieldToPayload]
   * @param {any} [fieldValue]
   * @param {object} [payloadRest]
   * @returns {{data: {payload: {}}, name}}
   */
  const generateMockData = (fieldName, addFieldToPayload, fieldValue, payloadRest) => {
    const base = {
      data: {
        payload: {}
      },
      name: fieldName
    }
    if(addFieldToPayload) {
      base.data.payload[fieldName] = fieldValue;
    }
    if(payloadRest) {
      base.data.payload = {
        ...payloadRest,
        ...base.data.payload,
      };
    }

    return base;
  }

  test('Expect error if payload sn not an object', () => {
    expect(() => validate({data: {}, name: 'example'})).toThrow('example: payload should be an object');
  });

  // name
  test('Expect error if payload has "name" field', () => {
    expect(() =>
      validate(generateMockData('name', false))
    )
      .toThrow('name: payload should have required field name');
  });

  test('Expect error if payload.name is empty', () => {
    expect(() =>
      validate(generateMockData('name', true)))
      .toThrow('name: payload.name should not be empty');
  });

  test('Expect error if payload.name is empty', () => {
    expect(() =>
      validate(generateMockData('name', true, 123)))
      .toThrow('name: payload.name should should be a string');
  });

  // email
  const namePayload = {name: 'string'};
  test('Expect error if payload has "email" field', () => {
    expect(() =>
      validate(generateMockData('email', false, undefined, namePayload))
    )
    .toThrow('email: payload should have required field email');
  });

  test('Expect error if payload.email is empty', () => {
    expect(() =>
      validate(generateMockData('email', true, undefined, namePayload)))
      .toThrow('email: payload.email should not be empty');
  });

  test('Expect error if payload.email is empty', () => {
    expect(() =>
      validate(generateMockData('email', true, 123, namePayload)))
      .toThrow('email: payload.email should should be a string');
  });

  // password
  const emailPayload = {name: 'string', email: 'test@gmail.com'};

  test('Expect error if payload has "password" field', () => {
    expect(() =>
      validate(generateMockData('password', false, undefined, emailPayload))
    )
      .toThrow('password: payload should have required field password');
  });

  test('Expect error if payload.password is empty', () => {
    expect(() =>
      validate(generateMockData('password', true, undefined, emailPayload)))
      .toThrow('password: payload.password should not be empty');
  });

  test('Expect error if payload.password is empty', () => {
    expect(() =>
      validate(generateMockData('password', true, 123, emailPayload)))
      .toThrow('password: payload.password should should be a string');
  });
});

describe('Test validateFields', () => {
  test('Test if data contain not allowed keys', () => {
    const testData = {
      data: {
        name: 'name',
        meta: {
          source: 'file',
          algorithm: 'gzip',
        },
        notAllowedKey1: 'notAllowedKey1'
      },
      name: 'notAllowedKey1'
    };
    expect(() => validateFields(testData, 'test1'))
      .toThrow('notAllowedKey1: data contains not allowed field — notAllowedKey1');
  });
});

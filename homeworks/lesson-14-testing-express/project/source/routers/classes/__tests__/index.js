import 'dotenv/config';
import request from 'supertest';
import { app } from '../../../server';
import jsonSchema from 'jsonschema';
import {setupAuthForTests} from "../../../utils/setupAuthForTests";
import {validationClassSchema} from "../../../utils";

const server = request.agent(app);

const classesSchema = {
  "type": "array",
  "items": validationClassSchema
};

const newClassExample = {
  title: "Data Science entry",
  description: "Data Science Entry Level 2",
  // hash: "3f2is264-5717-4562-b3fc-2c963f66as2j",
  // students: [
  //   {
  //     user: {
  //       name: {
  //         first: "Paul",
  //         last: "Ericson"
  //       },
  //       hash: "3fsa3mk64-5717-4562-b3fc-8s6f78s7fa6",
  //       roles: [
  //         "newbie"
  //       ]
  //     },
  //     status: "intermediate",
  //     notes: "strong dev"
  //   }
  // ],
  // lessons: [
  //   {
  //     lesson: {
  //       title: "Tensor Flow",
  //       description: "Tensor Flow introduction",
  //       hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //       order: 1,
  //       availability: [
  //         [
  //           "select",
  //           "premium"
  //         ]
  //       ]
  //     },
  //     scheduled: "2019-06-18T20:00:03.567Z"
  //   }
  // ],
  duration: {
    started: "2019-10-18T20:00:03.567Z",
    closed: "2019-10-19T12:04:10.304Z"
  },
  order: 2,
  // created: "2019-07-18T20:00:03.567Z",
  // modified: "2019-07-19T12:04:10.304Z"
};

describe('Should be possible to get all the classes', () => {
  test('Classes must match certain schema', async (done) => {
    const response = await server.get('/classes');

    const validator = new jsonSchema.Validator();
    const validationResult = validator.validate(response.data, classesSchema);
    expect(validationResult.errors.length).toBe(0);

    done();
  });
});

describe('Should be possible to get one class', () => {
  beforeAll(async done => {
    await setupAuthForTests(server);

    done();
  });

  test('If there is no classes with given hash, get 404', async (done) => {
    const response = await server.get('/classes/3');
    expect(response.statusCode).toBe(404);
    done();
  });

  test('Response should have status 200', async (done) => {
    const response = await server.get('/classes/3fa85f64-5717-4562-b3fc-2c963f66afa6');
    expect(response.statusCode).toBe(200);
    done();
  });

  test('Response should be an object with the certain schema', async (done) => {
    const response = await server.get('/classes/1');

    const validator = new jsonSchema.Validator();
    const validationResult = validator.validate(response.data, validationClassSchema);
    expect(validationResult.errors.length).toBe(0);
    done();
  });
});

describe('Should be possible to create a class', () => {
  beforeAll(async done => {
    await setupAuthForTests(server);

    done();
  });

  const newClassExample = {
    "title": "Data science 53",
    "description": "Data science entry level",
    "order": 1412,
    "duration": {
      "started": "2019-06-19T07:44:06.353Z",
      "closed": "2019-06-19T07:44:06.353Z"
    }
  };

  test('Response should have status 201', async (done) => {
    const response = await server.post('/classes').send(newClassExample);
    expect(response.statusCode).toBe(201);
    done();
  });

  test('One new class should be created and match schema', async (done) => {
    const response = await server.post('/classes').send(newClassExample);

    const validator = new jsonSchema.Validator();
    const validationResult = validator.validate(response.data, validationClassSchema);
    expect(validationResult.errors.length).toBe(0);

    done();
  });
});

describe('Should be possible to create a class', () => {
  beforeAll(async done => {
    await setupAuthForTests(server);

    done();
  });

  test('Response should have status 201', async (done) => {
    const response = await server.post('/classes').send(newClassExample);
    expect(response.statusCode).toBe(201);
    done();
  });

  test('One new class should be created and match schema', async (done) => {
    const response = await server.post('/classes').send(newClassExample);

    const validator = new jsonSchema.Validator();
    const validationResult = validator.validate(response.data, validationClassSchema);
    expect(validationResult.errors.length).toBe(0);

    done();
  });

  test('If pass extra field to request, get 400 error and validation error message', async (done) => {
    const response = await server.post('/classes').send({
      ...newClassExample,
      extraField: 'extraField'
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message.length > 0).toBeTruthy();

    done();
  });
});

describe('Should be possible to update a class', () => {
  beforeAll(async done => {
    await setupAuthForTests(server);

    done();
  });

  test('Response should have status 200', async (done) => {
    const responseUpdate = await server.put('/classes/772').send({
      description: 'Data Science Entry Level 2 modified'
    });
    expect(responseUpdate.statusCode).toBe(200);
    done();
  });

  test('Field update should be successful', async (done) => {
    await server.put('/classes/772').send({
      description: 'Data Science Entry Level 2 modified'
    });
    const responseGet = await server.get('/classes/772');
    expect(responseGet.body.description).toBe('Data Science Entry Level 2 modified');
    done();
  });

  test('Field update should be successful', async (done) => {
    await server.put('/classes/772').send({
      description: 'Data Science Entry Level 2 modified'
    });
    const responseGet = await server.get('/classes/772');
    expect(responseGet.body.description).toBe('Data Science Entry Level 2 modified');
    done();
  });

  test('If extra field provided, receive 400 error and error message', async (done) => {
    const response = await server.put('/classes/772').send({
      extraField: 'extraField'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message.length > 0).toBeTruthy();
    done();
  });

  test('If wrong class id provided, get 404 error', async (done) => {
    const response = await server.put('/classes/s99asd242j2sfd020dsk').send({
      description: 'Data Science Entry Level 2 modified'
    });
    expect(response.statusCode).toBe(404);
    done();
  });
});

describe('Should be possible to delete a class', () => {
  beforeAll(async done => {
    await setupAuthForTests(server);

    done();
  });

  const createClassForDeletion = async () => {
    const response = await server.post('/classes').send({
      ...newClassExample,
      title: 'Test for deletion',
    });
    if(response.statusCode !== 201) {
      throw new Error('Class was not created');
    }
    return response.body.hash;
  }

  test('Response should have status 200', async (done) => {
    const hash = await createClassForDeletion();
    const response = await server.delete('/classes/' + hash);
    expect(response.statusCode).toBe(200);
    done();
  });

  test('If wrong class id provided, get 404 error', async (done) => {
    const response = await server.delete('/classes/s99asd242j2sfd020dsk');
    expect(response.statusCode).toBe(404);
    done();
  });
});

describe('Should be possible to enroll a student to class', () => {
  beforeAll(async done => {
    await setupAuthForTests(server);

    done();
  });

  test('Successful Response should have status 200', async (done) => {
    const responseUpdate = await server.post('/classes/772/enroll').send({
      description: 'Data Science Entry Level 2 modified'
    });
    expect(responseUpdate.statusCode).toBe(200);
    done();
  });
});

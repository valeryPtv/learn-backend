import jsonSchema from "jsonschema";
import {path as rootPath} from 'app-root-path';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import {
  findEntityOrThrow,
  NotFoundError,
  ValidationError,
  validationEnrollStudentsSchema,
  validationClassSchema
} from "../../utils";

const validator = new jsonSchema.Validator();

const classesPath = path.join('@', '..', 'fakeFileDB' , 'classes.json');

export const getAll = async (req, res) => {
  try {
    const result = await readFile(classesPath, 'utf8');

    res.status(200).json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getOne = async (req, res) => {
  try {
    const result = await readFile(classesPath, 'utf8');

    const classEntry = findEntityOrThrow(req, JSON.parse(result), 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

const getClassesData = async () => {
  const collectionJson = await readFile(classesPath, 'utf8');
  return JSON.parse(collectionJson);
}

export const create = async (req, res) => {
  try {
    const validationResult = validator.validate(req.body, validationClassSchema);

    if(validationResult.errors.length > 0) {
      throw new ValidationError(validationResult.toString());
    }

    const collection = await getClassesData();
    const newClass = {
      ...req.body,
      hash: (Math.random() * 10000).toFixed()
    };

    collection.push(newClass);
    await writeFile(classesPath, JSON.stringify(collection), 'utf8');
    res.status(201).json(newClass);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const validationResult = validator.validate(req.body, {
      ...validationClassSchema,
      required: []
    });

    if(validationResult.errors.length > 0) {
      throw new ValidationError(validationResult.toString());
    }

    let collection = await getClassesData();
    let newClass = null;
    const newCollection = [...collection];

    newCollection.forEach((item, index, arr) => {
      if(item.hash === req.params.hash) {
        newClass = {
          ...item,
          ...req.body
        }
        arr[index] = newClass;
      }
    });

    if(!newClass) {
      throw new NotFoundError('Class with the provided hash was not found');
    }

    await writeFile(classesPath, JSON.stringify(newCollection), 'utf8');

    res.status(200).json(newClass);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

export const deleteEntity = async (req, res) => {
  try {
    const collection = [...(await getClassesData())];

    const classIndex = collection?.findIndex((item) => item.hash === req.params.hash);
    if(!classIndex || classIndex === -1) {
      throw new NotFoundError('There is no class with the provided id');
    }

    collection.splice(classIndex, 1);

    await writeFile(classesPath, JSON.stringify(collection), 'utf8');

    res.status(200).json({message: 'Deleted successfully'});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export const enrollStudentToClass = async (req, res) => {
  try {
    const validationResult = validator.validate(req.body, validationEnrollStudentsSchema);

    if(validationResult.errors.length > 0) {
      throw new ValidationError(validationResult.toString());
    }
    // Add check for if the user exists in users

    const collection = await getClassesData();
    // const newCollection = collection.filter((item) => item.hash !== req.params.hash);
    let changedClassItem = null;
    const newCollection = [];

    [...collection].forEach((classItem) => {
      if(req.params.hash === classItem.hash) {
        if(!Array.isArray(classItem?.students)) {
          classItem.students = [];
        }

        if(classItem.students.find((student) => student.user.hash === req.body.user)) {
          throw new Error('Student with the provided id already exists');
        }

        classItem.students.push({
          user: {
            hash: req.body.user,
            name: {
              first: 'John',
              last: 'Doe'
            },
            roles: [
              'newbie'
            ],
          },
          status: req.body.status,
          notes: req.body.notes,
        });

        changedClassItem = classItem;
      }

      newCollection.push(classItem);
    });

    if(!changedClassItem) {
      throw new NotFoundError('Class with the provided hash was not found');
    }

    await writeFile(classesPath, JSON.stringify(newCollection), 'utf8');

    // res.status(200).json(changedClassItem);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Incorrect payload' })
  }
}

const expelSchema = {
  type: 'object',
  properties: {
    user: { type: 'string' }
  },
  required: ['user'],
  additionalProperties: false
};

export const expelStudentFromClass = async (req, res) => {
  try {
    const validationResult = validator.validate(req.body, expelSchema);

    if(validationResult.errors.length > 0) {
      throw new ValidationError(validationResult.toString());
    }

    const newCollection = (await getClassesData()).map((classItem) => {
      if(req.params.hash === classItem.hash) {
        const studentIndex = classItem?.students?.findIndex((student) => student.user.hash === req.body.user);

        if(!studentIndex || studentIndex === -1) {
          throw new Error('There is no student with the provided id');
        }

        classItem.students.splice(studentIndex, 1);
      }

      return classItem;
    });

    await writeFile(classesPath, JSON.stringify(newCollection), 'utf8');

    /*
      post
      payload: {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      }
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/*
const classes = [
  {
    title: "Backend",
    description: "Backend Online Course",
    order: 2,
    duration: {
      started: "2019-06-19T07:44:06.353Z",
      closed: "2019-06-19T07:44:06.353Z"
    },
    hash: "1"
  },
  {
    title: "Data science",
    description: "Data science entry level",
    order: 2,
    duration: {
      started: "2019-06-19T07:44:06.353Z",
      closed: "2019-06-19T07:44:06.353Z"
    },
    hash: "2"
  },
];

const classes2 = [
  {
    title: "Backend Online", //
    description: "Backend Online 3", //
    hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    students: [
      {
        user: {
          name: {
            first: "John",
            last: "Doe"
          },
          hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          roles: [
            "newbie"
          ]
        },
        status: "select",
        notes: "не делает домашки"
      }
    ],
    lessons: [
      {
        lesson: {
          title: "Node.js",
          description: "Node.js introduction",
          hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          order: 1,
          availability: [
            [
              "select",
              "premium"
            ]
          ]
        },
        scheduled: "2019-06-18T20:00:03.567Z"
      }
    ],
    duration: { //
      started: "2019-06-18T20:00:03.567Z",
      closed: "2019-06-19T12:04:10.304Z"
    },
    order: 1, //
    created: "2019-06-18T20:00:03.567Z",
    modified: "2019-06-19T12:04:10.304Z"
  },
  {
    title: "Data Science entry",
    description: "Data Science Entry Level",
    hash: "3f2is264-5717-4562-b3fc-2c963f66as2j",
    students: [
      {
        user: {
          name: {
            first: "Raul",
            last: "Pidorus"
          },
          hash: "3fa85f64-5717-4562-b3fc-8s6f766afa6",
          roles: [
            "newbie"
          ]
        },
        status: "select",
        notes: "не делает домашки"
      }
    ],
    lessons: [
      {
        lesson: {
          title: "Tensor Flow",
          description: "Tensor Flow introduction",
          hash: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          order: 1,
          availability: [
            [
              "select",
              "premium"
            ]
          ]
        },
        scheduled: "2019-06-18T20:00:03.567Z"
      }
    ],
    duration: {
      started: "2019-10-18T20:00:03.567Z",
      closed: "2019-10-19T12:04:10.304Z"
    },
    order: 2,
    created: "2019-07-18T20:00:03.567Z",
    modified: "2019-07-19T12:04:10.304Z"
  },
];
 */

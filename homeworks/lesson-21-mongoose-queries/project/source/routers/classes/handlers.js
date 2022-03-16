import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import {
  NotFoundError,
  validationEnrollStudentsSchema,
  validationClassSchema, validateAndThrow, genericErrorHandler
} from "../../utils";
import {classesController} from "../../controllers";

const classesPath = path.join('@', '..', 'fakeFileDB' , 'classes.json');

export const getAll = async (req, res) => {
  try {
    const result = await classesController.get();

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const getOne = async (req, res) => {
  try {
    const result = await classesController.getOne(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
  }
}

const getClassesData = async () => {
  const collectionJson = await readFile(classesPath, 'utf8');
  return JSON.parse(collectionJson);
}

/*
  body: {
  "title": "Backend",
  "description": "Backend Online Course",
  "order": 2,
  "duration": {
    "started": "2019-06-19T07:44:06.353Z",
    "closed": "2019-06-19T07:44:06.353Z"
   }
  }
 */
export const create = async (req, res) => {
  try {
    validateAndThrow(req.body, validationClassSchema);
    const result = await classesController.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
  }
}

export const update = async (req, res) => {
  try {
    validateAndThrow(req.body, validationClassSchema);
    const newClass = await classesController.updateOne(req.params.id, req.body);

    if(!newClass) {
      throw new NotFoundError('Class with the provided id was not found');
    }

    res.status(200).json(newClass);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
  }
}

export const deleteEntity = async (req, res) => {
  try {
    const result = await classesController.deleteOne(req.params.id);

    if(!result) {
      throw new NotFoundError('There is no class with the provided id');
    }

    res.status(200).json({message: 'Deleted successfully'});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const enrollStudentToClass = async (req, res) => {
  try {
    validateAndThrow(req.body, validationEnrollStudentsSchema);

    // Add check for if the user exists in users
    const collection = await getClassesData();
    // const newCollection = collection.filter((item) => item.id !== req.params.id);
    let changedClassItem = null;
    const newCollection = [];

    [...collection].forEach((classItem) => {
      if(req.params.id === classItem.id) {
        if(!Array.isArray(classItem?.students)) {
          classItem.students = [];
        }

        if(classItem.students.find((student) => student.user.id === req.body.user)) {
          throw new Error('Student with the provided id already exists');
        }

        classItem.students.push({
          user: {
            id: req.body.user,
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
      throw new NotFoundError('Class with the provided id was not found');
    }

    await writeFile(classesPath, JSON.stringify(newCollection), 'utf8');

    // res.status(200).json(changedClassItem);
    res.sendStatus(204);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
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
    validateAndThrow(req.body, expelSchema);

    const newCollection = (await getClassesData()).map((classItem) => {
      if(req.params.id === classItem.id) {
        const studentIndex = classItem?.students?.findIndex((student) => student.user.id === req.body.user);

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
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
  }
}

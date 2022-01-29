import { findEntityOrThrow } from "../../utils";

const classes = [
  {
    "title": "Backend",
    "description": "Backend Online Course",
    "order": 2,
    "duration": {
      "started": "2019-06-19T07:44:06.353Z",
      "closed": "2019-06-19T07:44:06.353Z"
    },
    "hash": "1"
  },
  {
    "title": "Data science",
    "description": "Data science entry level",
    "order": 2,
    "duration": {
      "started": "2019-06-19T07:44:06.353Z",
      "closed": "2019-06-19T07:44:06.353Z"
    },
    "hash": "2"
  },
];

export const getAll = (req, res) => {
  try {
    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getOne = (req, res) => {
  try {
    const classEntry = findEntityOrThrow(req, classes, 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const create = (req, res) => {
  try {
    res.status(201).json({
      ...req.body,
      hash: (Math.random() * 10).toFixed()
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const update = (req, res) => {
  try {
    const classEntry = findEntityOrThrow(req, classes, 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const deleteEntity = (req, res) => {
  try {
    const classEntry = findEntityOrThrow(req, classes, 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

export const enrollStudentToClass = (req, res) => {
  try {
    /*
      post
      payload: {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "status": "select",
        "notes": "отличный студент"
      }
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const expelStudentFromClass = (req, res) => {
  try {
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

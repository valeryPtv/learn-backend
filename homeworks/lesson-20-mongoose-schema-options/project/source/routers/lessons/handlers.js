import { findEntityOrThrow } from "../../utils";

const lessons = [
  {
    "title": "Backend",
    "description": "Backend Online Course",
    "order": 1,
    "hash": "1",
    "availability": [
      [
        "select",
        "premium"
      ]
    ],
    "content": {
      "videos": [
        {
          "title": "Node.js architecture",
          "order": 1,
          "uri": "https://lectrum.io/videos/lesson-1"
        }
      ],
      "keynotes": [
        {
          "title": "Node.js architecture",
          "order": 1,
          "uri": "https://lectrum.io/keynotes/lesson-1"
        }
      ]
    }
  },
  {
    "title": "Data Science",
    "description": "Data science entry level",
    "order": 2,
    "hash": "2",
    "availability": [
      [
        "select",
        "premium"
      ]
    ],
    "content": {
      "videos": [
        {
          "title": "Node.js architecture",
          "order": 1,
          "uri": "https://lectrum.io/videos/lesson-1"
        }
      ],
      "keynotes": [
        {
          "title": "Node.js architecture",
          "order": 1,
          "uri": "https://lectrum.io/keynotes/lesson-1"
        }
      ]
    }
  },
];

export const getAll = (req, res) => {
  try {
    res.status(200).json(lessons);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getOne = (req, res) => {
  try {
    const classEntry = findEntityOrThrow(req, lessons, 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    console.error(error);
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
    const classEntry = findEntityOrThrow(req, lessons, 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const deleteEntity = (req, res) => {
  try {
    const classEntry = findEntityOrThrow(req, lessons, 'hash');
    res.status(200).json(classEntry);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

// Materials
export const getVideoFromLesson = (req, res) => {
  try {
    /*
      get
      req.params.lessonHash, req.params.videoHash
     */
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const addVideoToLesson = (req, res) => {
  try {
    /*
      post
      req.params.lessonHash
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteVideoFromLesson = (req, res) => {
  try {
    /*
      delete
      req.params.lessonHash, req.params.videoHash
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const addKeynoteToLesson = (req, res) => {
  try {
    /*
      post
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getKeynoteFromLesson = (req, res) => {
  try {
    /*
      get
      req.params.lessonHash, req.params.keynoteHash
     */
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteKeynoteFromLesson = (req, res) => {
  try {
    /*
      delete
      req.params.lessonHash, req.params.keynoteHash
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

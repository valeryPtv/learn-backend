import {
  genericErrorHandler,
  NotFoundError,
  validateAndThrow,
  validationLessonSchema
} from "../../utils";
import {lessonsController} from "../../controllers";

export const getAll = async (req, res) => {
  try {
    const result = await lessonsController.get();

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const getOne = async (req, res) => {
  try {
    const result = await lessonsController.getOne(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
  }
}

export const create = async (req, res) => {
  try {
    validateAndThrow(req.body, validationLessonSchema);
    const result = await lessonsController.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const update = async (req, res) => {
  try {
    validateAndThrow(req.body, validationLessonSchema);
    const result = await lessonsController.updateOne(req.params.id, req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
    genericErrorHandler(error);
  }
}

export const deleteEntity = async (req, res) => {
  try {
    const result = await lessonsController.deleteOne(req.params.id);

    if(!result) {
      throw new NotFoundError('There is no lesson with the provided id');
    }

    res.status(200).json({message: 'Deleted successfully'});
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
    genericErrorHandler(error);
  }
}

// Materials
export const getVideoFromLesson = (req, res) => {
  try {
    /*
      get
      req.params.lessonId, req.params.videoId
     */
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const addVideoToLesson = (req, res) => {
  try {
    /*
      post
      req.params.lessonId
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
      req.params.lessonId, req.params.videoId
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
      req.params.lessonId, req.params.keynoteId
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
      req.params.lessonId, req.params.keynoteId
     */
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

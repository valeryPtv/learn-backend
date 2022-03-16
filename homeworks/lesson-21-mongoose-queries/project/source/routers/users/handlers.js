import {
  genericErrorHandler,
  NotFoundError,
  validateAndThrow,
  validationUserSchema
} from "../../utils";
import {usersController} from "../../controllers";

const transformInput = (input) => {
  return {
    name: {
      first: '',
      last: ''
    }
  }
}

export const getAll = async (req, res) => {
  try {
    const result = await usersController.get();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const getOne = async (req, res) => {
  try {
    const result = await usersController.getOne(req.params.userHash);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const create = async (req, res) => {
  try {
    validateAndThrow(req.body, validationUserSchema);
    const result = await usersController.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

export const update = async (req, res) => {
  try {
    validateAndThrow(req.body, validationUserSchema);
    const result = await usersController.updateOne(req.params.userHash, req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    genericErrorHandler(error);
  }
}

export const deleteEntity = async (req, res) => {
  try {
    const result = await usersController.deleteOne(req.params.userHash);

    if(!result) {
      throw new NotFoundError('There is no user with the provided id');
    }

    res.status(200).json({message: 'Deleted successfully'});
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    genericErrorHandler(error);
  }
}

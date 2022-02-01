import {NotFoundError} from "../utils/errors";

export const checkIfEndpointExistsMiddleware = (req, res, next) => {
  const error = new NotFoundError(`${new Date().toISOString()}: Endpoint for ${req.method} ${req.originalUrl} doesn't exist`);
  next(error);
}

import { logger } from "../utils/logger";
import {globalErrorHandler} from "../utils/errors";

export const errorLoggerMiddleware = async (err, req, res, next) => {
  if(err) {
    await globalErrorHandler(err);
    res.status(err.statusCode || 500).json({message: err.message});
    return;
  }

  next();
};

import { logger } from "../utils/logger";
import {genericErrorHandler} from "../utils/errors";

export const errorLoggerMiddleware = async (err, req, res, next) => {
  if(err) {
    await genericErrorHandler(err);
    // console.log('errorLoggerMiddleware');
    // console.trace();
    // res.status(err.statusCode || 500);
    res.status(err.statusCode || 500).json({message: err.message});
    return;
  }

  next();
};

import {path as rootPath} from 'app-root-path';
import fs from 'fs/promises';
import path from 'path';
import winston from "winston";

import {ValidationError} from "./validationError";
import {NotFoundError} from "./notFoundError";
import {logger} from "../logger";
import { logsController } from "../../controllers/logs";

const handleWriteToFile = async (fileName, message) => {
  try {
    const logPath = path.join(rootPath, 'logs', fileName);
    await fs.appendFile(logPath, message, 'utf8');
  } catch (error) {
    winston.error(error);
  }
}

export const globalErrorHandler = async (err) => {
  logger.error(`${err.message}\n${err.stack}`);

  switch(true) {
    case err instanceof ValidationError:
      return await handleWriteToFile('validation_errors.log', err.message);

    case err instanceof NotFoundError:
      return await handleWriteToFile('not_found_errors.log', err.message);

    default:
      return await handleWriteToFile('errors.log', `${new Date().toISOString()}: ${err.message}\n`);
  }
}

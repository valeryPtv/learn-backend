import {logger} from "../utils/logger";

export const requestLoggerMiddleware = (req, res, next) => {
  let body = null;

  if (req.method !== 'GET') {
    body = JSON.stringify(req.body, null, 2);
  }

  // const message = [
  //   `Requesting ${req.originalUrl}`,
  //   `\tRequest method: ${req.method}`,
  //   `\tDatetime: ${new Date().toISOString()}`,
  //   `\tPayload: ${JSON.stringify(req.body)}`,
  // ].join('\n');

  logger.debug(`${req.method} ${body ? `\n${body}` : ''}`);

  next();
};

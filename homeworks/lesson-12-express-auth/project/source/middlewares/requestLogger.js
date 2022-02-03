import {logger} from "../utils/logger";

export const requestLoggerMiddleware = (req, res, next) => {
  const message = [
    `Requesting ${req.originalUrl}`,
    `\tRequest method: ${req.method}`,
    `\tDatetime: ${new Date().toISOString()}`,
    `\tPayload: ${JSON.stringify(req.body)}`,
  ].join('\n');

  logger.debug({
    level: 'debug',
    message,
  });

  next();
};

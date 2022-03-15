import {logger} from "../utils/logger";

export const requestLoggerMiddleware = (req, res, next) => {
  const body = req.method === 'GET' ? '' : `\n${JSON.stringify(req.body, null, 2)}`;

  // const message = [
  //   `Requesting ${req.originalUrl}`,
  //   `\tRequest method: ${req.method}`,
  //   `\tDatetime: ${new Date().toISOString()}`,
  //   `\tPayload: ${JSON.stringify(req.body)}`,
  // ].join('\n');


  logger.info(`${req.method} ${req.originalUrl}${body}`);

  next();
};

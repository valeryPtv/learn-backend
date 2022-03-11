import { format, createLogger, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`
});

export const logger = createLogger({
  format: combine(timestamp(), logFormat),
  level: 'debug',
  transports: [new transports.Console ]
});

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

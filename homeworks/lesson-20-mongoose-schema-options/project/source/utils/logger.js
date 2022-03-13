import { format, createLogger, transports } from 'winston';
import { getDBUrl } from "./env/getDBUrl";
import {WinstonDBTransport} from "./winstonDBTransport";

const { combine, timestamp, label, printf } = format;

const { DB_URL } = getDBUrl();

const logFormat = printf(({ level, message, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`
});

const createConsoleTransport = (level = 'debug') => new transports.Console({
  level,
  colorize : true
});

export const logger = createLogger({
  format: combine(timestamp(), logFormat),
  // level: 'debug',
  transports: [
    // new transports.Console
    createConsoleTransport('debug'),
    createConsoleTransport('info'),
    createConsoleTransport('error'),
    new WinstonDBTransport({level: 'info'}),
    new WinstonDBTransport({level: 'error'}),
  ]
});

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

import Transport from 'winston-transport';
import {logsController} from "../controllers/logs";

export class WinstonDBTransport extends Transport {
  constructor(opts) {
    super(opts);
  }
  async log({message}, next) {
    try {
      await logsController.create({message})
      next();
    } catch (error) {
      console.error(error);
    }
    // do whatever you want with log data
  }
};

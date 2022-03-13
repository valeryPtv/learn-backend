import Transport from 'winston-transport';
import {logsController} from "../controllers/logs";

export class WinstonDBTransport extends Transport {
  constructor(opts) {
    super(opts);
  }
  async log(info, next) {
    // console.log({info});
    try {
      await logsController.create(info)
      next();
    } catch (error) {
      console.error(error);
    }
    // do whatever you want with log data
  }
};

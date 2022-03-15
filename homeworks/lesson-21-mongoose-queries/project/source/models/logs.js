import mongoose from 'mongoose';
import { logsSchema } from "../schemas/logs";

const logsOdm = mongoose.model('logs', logsSchema);

class LogsModelCreator {
  async create(data) {
    return await logsOdm.create(data);
  }

  async get(query = {}, projection = {}) {
    return await logsOdm.find(query, projection).exec();
  }

  /*
  async deleteOne(query, options = {}) {
    if(!query) {
      return;
    }

    return await logsOdm.deleteOne(query, options).exec();
  }
   */
}

export const logsModel = new LogsModelCreator();

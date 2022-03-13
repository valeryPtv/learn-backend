import { logsModel } from "../models";

export class UsersControllerCreator {
  async get(query = {}) {
    return await logsModel.get(query);
  }

  async create(data) {
    return await logsModel.create(data);
  }
  //
  // async delete(query, options = {}) {
  //   return await logsModel.delete(query, options);
  // }
}

export const logsController = new UsersControllerCreator();

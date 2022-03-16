import { usersModel } from "../models";

class UsersControllerCreator {
  // data <- req.body
  async get(query = {}, projection = {}) {
    return await usersModel.get(query, projection);
  }

  async getOne(hash, projection = {}) {
    return await usersModel.getOne(hash, projection);
  }

  async create(data) {
    return await usersModel.create(data);
  }

  async updateOne(hash, payload) {
    return await usersModel.updateOne(hash, payload);
  }

  async deleteOne(hash) {
    return await usersModel.deleteOne(hash);
  }
}

export const usersController = new UsersControllerCreator();

import { usersModel } from "../models";

class UsersControllerCreator {
  async get(query = {}) {
    return await usersModel.get(query);
  }

  async create(data) {
    return await usersModel.create(data);
  }
}

export const usersController = new UsersControllerCreator();

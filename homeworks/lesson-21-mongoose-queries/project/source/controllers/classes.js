import { classesModel } from "../models";

class ClassesControllerCreator {
  // data <- req.body
  async get(query = {}, projection = {}) {
    return await classesModel.get(query, projection);
  }

  async getOne(id, projection = {}) {
    return await classesModel.getOne(id, projection);
  }

  async create(data) {
    return await classesModel.create(data);
  }

  async updateOne(id, payload) {
    return await classesModel.updateOne(id, payload);
  }

  async deleteOne(id) {
    return await classesModel.deleteOne(id);
  }
}

export const classesController = new ClassesControllerCreator();

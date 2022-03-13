import { classesModel } from "../models";

class ClassesControllerCreator {
  // data <- req.body
  async get(query = {}) {
    return await classesModel.get(query);
  }

  async create(data) {
    return await classesModel.create(data);
  }
}

export const classesController = new ClassesControllerCreator();

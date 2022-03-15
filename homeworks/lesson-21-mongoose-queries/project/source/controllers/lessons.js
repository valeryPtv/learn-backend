import {lessonsModel} from "../models";

class LessonsControllerCreator {
  // data <- req.body
  async get(query = {}, projection = {}) {
    return await lessonsModel.get(query, projection);
  }

  async getOne(id, projection = {}) {
    return await lessonsModel.getOne(id, projection);
  }

  async create(data) {
    return await lessonsModel.create(data);
  }

  async updateOne(id, payload) {
    return await lessonsModel.updateOne(id, payload);
  }

  async deleteOne(id) {
    return await lessonsModel.deleteOne(id);
  }
}

export const lessonsController = new LessonsControllerCreator();

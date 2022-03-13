import { lessonsModel } from "../models";

export class LessonsControllerCreator {
  async get(query = {}) {
    return await lessonsModel.get(query);
  }

  async create(data) {
    return await lessonsModel.create(data);
  }
}

export const lessons = new LessonsControllerCreator();

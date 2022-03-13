import mongoose from 'mongoose';
import { lessonsSchema } from "../schemas";

const lessonsOdm = mongoose.model('lessons', lessonsSchema);

class LessonsModelCreator {
  async create(data) {
    return await lessonsOdm.create(data);
  }
  async get(query = {}) {
    return await lessonsOdm.find(query).exec();
  }
}

export const lessonsModel = new LessonsModelCreator();

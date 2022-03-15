import mongoose from 'mongoose';
import { lessonsSchema } from "../schemas";

const lessonsOdm = mongoose.model('lessons', lessonsSchema);

class LessonsModelCreator {
  async get(query = {}, projection = {}) {
    return await lessonsOdm.find(query, projection).exec();
  }

  async create(data) {
    return await lessonsOdm.create(data);
  }

  async getOne(id, projection = {}) {
    return await lessonsOdm.findById(id, projection).exec();
  }

  async updateOne(id, payload) {
    return await lessonsOdm.findOneAndUpdate(id, payload, { new: true, upsert: true }).exec();
  }

  async deleteOne(id) {
    return await lessonsOdm.findOneAndDelete(id).exec();
  }
}

export const lessonsModel = new LessonsModelCreator();

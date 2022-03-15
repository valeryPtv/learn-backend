import mongoose from 'mongoose';
import { classesSchema } from "../schemas";

const classesOdm = mongoose.model('classes', classesSchema);

class ClassesModelCreator {
  /*
  constructor(data) {
    this.data = data;
  }
   */

  async get(query = {}, projection = {}) {
    return await classesOdm.find(query, projection).exec();
  }

  async create(data) {
    return await classesOdm.create(data);
  }

  async getOne(id, projection = {}) {
    return await classesOdm.findById(id, projection).exec();
  }

  async updateOne(id, payload) {
    return await classesOdm.findOneAndUpdate(id, payload, { new: true, upsert: true }).exec();
  }

  async deleteOne(_id) {
    return await classesOdm.findOneAndDelete({ _id }).exec();
  }
}

export const classesModel = new ClassesModelCreator();

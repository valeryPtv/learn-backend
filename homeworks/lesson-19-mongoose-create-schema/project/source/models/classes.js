import mongoose from 'mongoose';
import { classesSchema } from "../schemas";

const classesOdm = mongoose.model('classes', classesSchema);

export class ClassesModel {
  /*
  constructor(data) {
    this.data = data;
  }
   */

  async get(query = {}) {
    return await classesOdm.find(query).exec();
  }

  async create(data) {
      return await classesOdm.create(data);
  }
}

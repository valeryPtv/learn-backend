import mongoose from 'mongoose';
import { usersSchema } from "../schemas";

const usersOdm = mongoose.model('users', usersSchema);

class UsersModelCreator {
  async create(data) {
    return await usersOdm.create(data);
  }
  async get(query = {}) {
    return await usersOdm.find(query).exec();
  }
}

export const usersModel = new UsersModelCreator();

import mongoose from 'mongoose';
import { usersSchema } from "../schemas";

export const usersModel = mongoose.model('users', usersSchema);

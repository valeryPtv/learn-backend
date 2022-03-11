import mongoose from 'mongoose';
import { lessonsSchema } from "../schemas";

export const lessonsModel = mongoose.model('lessons', lessonsSchema);

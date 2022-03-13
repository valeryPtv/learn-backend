import mongoose from 'mongoose';
// Schema from task
// TODO: create schema that is consistent with olg logging system
//  and use it from winston
export const logsSchema = new mongoose.Schema({
  method: String,
  path: String,
  duration: {
    start: Date, // Date
    end: Date // Date
  },
  payload: Object, // Object
  agent: String
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: false
  },
  capped: {
    size: 50 * 1024 * 1024,
    max: 50000
  }
});

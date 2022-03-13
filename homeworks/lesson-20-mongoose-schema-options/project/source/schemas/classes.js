import mongoose from 'mongoose';

export const classesSchema = new mongoose.Schema({
  title:       mongoose.Schema.Types.Mixed,
  description: mongoose.Schema.Types.Mixed,
  // title:       String,
  // description: String,
  // hash:     {
  //   type: String,
  //   unique: true
  // },
  students: [
    {
      // user:     mongoose.schemaTypes.ObjectID,
      user:     mongoose.Schema.Types.ObjectId,
      status:   String,
      expelled: Boolean,
      notes:    String
    }
  ],
  lessons:  [
    {
      lesson:    mongoose.Schema.Types.ObjectId,
      scheduled: Date,
    }
  ],
  duration: {
    started: Date,
    closed:  Date
  },
  order:    {
    index: true,
    type: Number,
  },
  created:  Date,
  modified: Date
}, {
  timestamps: {
    createdAt: 'created',
    modifiedAt: 'modified'
  }
});

classesSchema.index({ title: 'text', description: 'text'});

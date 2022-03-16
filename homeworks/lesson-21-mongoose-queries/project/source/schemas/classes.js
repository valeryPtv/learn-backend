import mongoose from 'mongoose';

export const studentSchema = new mongoose.Schema({
  user:     mongoose.Schema.Types.ObjectId,
  status:   String,
  expelled: Boolean,
  notes:    String
})

export const classesSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  // title:       String,
  // description: String,
  // hash:     {
  //   type: String,
  //   unique: true
  // },
  students: [ studentSchema ],
  lessons:  [
    {
      lesson:    mongoose.Schema.Types.ObjectId,
      scheduled: Date,
    }
  ],
  duration: {
    started: {
      type: Date,
      required: true
    },
    closed: {
      type: String,
      required: true
    },
  },
  order:    {
    index: true,
    type: Number,
    required: true,
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
});

classesSchema.index({ title: 'text', description: 'text'});

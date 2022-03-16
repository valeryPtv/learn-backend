import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  videos: [
    {
      // hash:     {
      //   type: String,
      //   unique: true
      // },
      title: String,
      order: Number,
      uri:   String
    }
  ],
  keynotes: [
    {
      // hash:     {
      //   type: String,
      //   unique: true
      // },
      title: String,
      order: Number,
      uri:   String
    }
  ]
});

export const lessonsSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  order:    {
    index: true,
    type: Number,
  },
  // hash:     {
  //   type: String,
  //   unique: true
  // },
  availability: {
    type: [ String ],
    required: true,
  },
  content: contentSchema,
  created:  Date,
  modified: Date
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
});

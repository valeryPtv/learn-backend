import mongoose from 'mongoose';

export const lessonsSchema = new mongoose.Schema({
  title:        String,
  description:  String,
  order:    {
    index: true,
    type: Number,
  },
  hash:     {
    type: String,
    unique: true
  },
  availability: [
    String
  ],
  content: {
    videos: [
      {
        hash:     {
          type: String,
          unique: true
        },
        title: String,
        order: Number,
        uri:   String
      }
    ],
    keynotes: [
      {
        hash:     {
          type: String,
          unique: true
        },
        title: String,
        order: Number,
        uri:   String
      }
    ]
  },
  created:  Date,
  modified: Date
}, {
  timestamps: {
    createdAt: 'created',
    modifiedAt: 'modified'
  }
});

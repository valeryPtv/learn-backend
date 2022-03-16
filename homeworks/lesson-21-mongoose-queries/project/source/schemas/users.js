import mongoose from 'mongoose';

export const usersSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    select: false
  },
  hash:     {
    type: String,
    unique: true,
    index: true
  },
  name: {
    first: {
      type: String,
      index: true,
      required: true
    },
    last:  {
      type: String,
      index: true,
      required: true
    },
  },
  phones: [
    {
      phone:   {
        type: String,
        required: true
      },
      primary: Boolean
    }
  ],
  emails: [
    {
      email:   {
        type: String,
        unique: true,
        required: true
      },
      primary: Boolean
    }
  ],
  password: {
    type: String,
    required: true,
  },
  sex:      {
    type: String,
    required: true,
  },
  roles:    {
    type: [ String ],
    validate: (arr) => Array.isArray(arr) && arr.length > 0
  },
  social:   {
    facebook: String,
    linkedin: String,
    github:   String,
    skype:    String
  },
  notes:    String,
  disabled: Boolean
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
});

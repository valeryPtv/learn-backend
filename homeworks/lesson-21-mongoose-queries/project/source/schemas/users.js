import mongoose from 'mongoose';

export const usersSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      index: true
    },
    last:  {
      type: String,
      index: true
    },
  },
  phones: [
    {
      phone:   String,
      primary: Boolean
    }
  ],
  emails: [
    {
      email:   {
        type: String,
        unique: true,
      },
      primary: Boolean
    }
  ],
  password: String,
  sex:      String,
  roles:    [
    String
  ],
  social:   {
    facebook: String,
    linkedin: String,
    github:   String,
    skype:    String
  },
  notes:    String,
  hash:     {
    type: String,
    unique: true
  },
  disabled: Boolean
}, {
  timestamps: {
    createdAt: 'created',
    modifiedAt: 'modified'
  }
});

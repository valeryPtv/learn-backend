import mongoose from 'mongoose';
import { usersSchema } from "../schemas";
import { v4 } from 'uuid';
const usersOdm = mongoose.model('users', usersSchema);

const transformDataForCreate = (data) => ({
  ...data,
  _id: mongoose.Types.ObjectId(),
  hash: v4(),
  emails: [ { email: data.email, primary: true } ],
  phones: [ { phone: data.phone, primary: true } ],
  roles: data?.role ? [ data.role ] : null,
  notes: '',
  disabled: false,
  social: null
});

class UsersModelCreator {
  /*
  constructor(data) {
    this.data = data;
  }
   */

  async get(query = {}, projection = {}) {
    return await usersOdm.find(query, projection).exec();
  }

  async create(data) {
    const newData = transformDataForCreate(data);
    console.log({newData});
    return await usersOdm.create(newData);
  }

  async getOne(hash, projection = {}) {
    return await usersOdm.findOne({ hash }, projection).exec();
  }

  async updateOne(hash, payload) {
    const existData = await this.getOne(hash);
    let newData = null;

    const getNewCol = (colName, fieldName) => {
      if(!existData) {
        return
      }
      const newCol = existData[colName].slice();
      const index = newCol.findIndex((item) => item[fieldName] === payload[fieldName]);
      if(index === -1) {
        newCol.push({primary: true, [fieldName]: payload[fieldName]});
      } else {
        newCol.splice(index, 1, {
          primary: newCol[index].primary,
          [fieldName]: payload[fieldName]
        })
      }

      return newCol;
    };

    if(existData) {
      newData = {
        ...payload,
        emails: getNewCol('emails', 'email'),
        phones: getNewCol('phones', 'phone'),
        $addToSet: {
          roles: payload.role
        }
      };
    } else {
      newData = transformDataForCreate(payload);
    }

    return await usersOdm.findOneAndUpdate({ hash }, newData, { new: true, upsert: true }).exec();
  }

  async deleteOne(hash) {
    return await usersOdm.findOneAndDelete({ hash }).exec();
  }
}

export const usersModel = new UsersModelCreator();

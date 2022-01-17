import net from 'net';
import path from 'path';
import {fileURLToPath} from 'url';
import { Transform, pipeline } from 'stream';
import os from "os";
import JSONStream from 'JSONStream'
import { createReadStream } from 'fs';

const PORT = process.env.PORT || 8080;
const server = net.createServer();

const isObject = (value) => typeof value === 'object' && value !== null;

const getDirname = () => fileURLToPath(import.meta.url);

const transformToCsv = (chunk) => {
  const parsedJSON = JSON.parse(chunk.toString());
  const headers = Object.keys(parsedJSON[ 0 ]).join(';') + os.EOL;

  return parsedJSON.reduce((acc, curr) => {
    return acc + Object.values(curr).join(';') + os.EOL;
  }, headers);
}

class FilterDataStream extends Transform {
  constructor(filterConfigBuffer, streamOptions = {}) {
    super({ objectMode: true, ...streamOptions });
    this._filterObject = JSON.parse(filterConfigBuffer.toString());
  }

  _transform(chunkObject, encoding, done) {
    const validation = FilterDataStream.validateFields(this._filterObject);
    if(validation.length) {
      this.push(Buffer.from(JSON.stringify(validation)));
      return;
    }
    const isCorrect = FilterDataStream.filterItem(chunkObject, this._filterObject);
    isCorrect && this.push(Buffer.from(JSON.stringify(chunkObject)))
    done();
  }

  static fieldsSchema = {
    name: {
      first: 'string',
      last: 'string'
    },
    phone: 'string',
    address: {
      zip: 'string',
      city: 'string',
      country: 'string',
      street: 'string',
    },
    email: 'string',
  }

  static validateFields(filterSettings) {
    const errorTexts = [];
    const recursiveHandle = (settings, schema) => {
      Object.entries(settings).forEach(([ settingKey, settingValue ]) => {
        if(isObject(settingValue) && settingKey in schema) {
          recursiveHandle(settingValue, schema[settingKey]);
        }
        if (!(settingKey in schema)) {
          errorTexts.push(`there is no such key as ${settingKey} in schema`);
        }
        let settingType = typeof schema[ settingKey ] === 'object' ? 'object' : schema[ settingKey ];

        if (typeof settingValue !== settingType) {
          errorTexts.push(`key: '${settingKey}' must have type of ${schema[ settingKey ]}`);
        }
        if(isObject(settingValue) && !Object.keys(settingValue).length) {
          errorTexts.push(`key: '${settingKey}' must be non-empty object`);
        }
      });
    };
    recursiveHandle(filterSettings, FilterDataStream.fieldsSchema);

    return errorTexts;
  }

  static filterItem(dataItem, filterConfig) {
    return Object.entries(filterConfig).every((filterEntry) => {
      const [filterKey, filterValue] = filterEntry;
      // Map chunk by filter key
      const chunkFieldValue = dataItem[filterKey];
      if (chunkFieldValue) {
        if (isObject(chunkFieldValue) && isObject(filterValue)) {
          return FilterDataStream.filterItem(chunkFieldValue, filterValue);
        }

        return typeof chunkFieldValue === 'string' && chunkFieldValue.includes(filterValue);
      }

      return false;
    });
  }
}

server.on('connection', (socket) => {
  socket.on('data', async (message) => {
    try {
      pipeline(
        createReadStream(path.join(getDirname(), '../..', 'users.json')),
        JSONStream.parse('*'),
        new FilterDataStream(message),
        socket,
        (error) => console.error(error),
      )
    } catch (error) {
      console.error(error);
    }
  })
});

server.on('error', (error) => {
  console.error('Net server error', error);
})

server.listen(PORT);

// console.log({addr: server.address(), usersPath: path.join(getDirname(), '../..', 'users.json'), metaURL: import.meta.url})\
// /*

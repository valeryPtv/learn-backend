import net from 'net';
import path from 'path';
import {fileURLToPath} from 'url';
import { Transform, pipeline } from 'stream';
import os from "os";
import JSONStream from 'JSONStream'
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';

const PORT = process.env.PORT || 8080;
const server = net.createServer();

const isObject = (value) => typeof value === 'object' && value !== null;

const getDirname = () => fileURLToPath(import.meta.url);

class FilterDataStream extends Transform {
  constructor(filterConfigBuffer, streamOptions = {}) {
    super({ objectMode: true, ...streamOptions });
    this.configFromMessage = filterConfigBuffer;
  }

  _transform(chunkObject, encoding, done) {
    const validation = FilterDataStream.validateFields(this.configFromMessage.filter);
    if(validation.length) {
      // this.push(Buffer.from(JSON.stringify(validation)));
      this.push(JSON.stringify(validation));
      return;
    }
    const isCorrect = FilterDataStream.filterItem(chunkObject, this.configFromMessage.filter);
    // isCorrect && this.push(Buffer.from(JSON.stringify(chunkObject)))
    isCorrect && this.push(JSON.stringify(chunkObject));
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
        const settingType = typeof schema[ settingKey ] === 'object' ? 'object' : schema[ settingKey ];

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

class TransformToCSV extends Transform {
  constructor(streamOptions = {}) {
    super({ encoding: "utf8", ...streamOptions });
  }

  static transformToCsv (chunk) {
    const parsedJSON = JSON.parse(chunk.toString());

    const headers = Object.keys(parsedJSON).join(';') + os.EOL;

    return Object.values(parsedJSON).reduce((acc, curr) => {
      const value = typeof curr === 'object' ? JSON.stringify(curr) : curr;

      return acc + value + ';';
    }, headers) + os.EOL;
  }

  _transform(chunk, encoding, done) {
    this.push(JSON.stringify(TransformToCSV.transformToCsv(chunk)));
    done();
  }
}

class DataConverter extends Transform {
  constructor(chunk, streamOptions = {}) {
    // super({ objectMode: true, ...streamOptions });
    super({ encoding: "utf8", ...streamOptions });
  }

  _transform(chunk, encoding, done) {
    const streams = [];
    if('meta' in chunk && chunk.meta.format === 'csv') {
      // const tr = new TransformToCSV();
      // tr.push(chunk.data)
      // streams.push(tr);
      const tr = new TransformToCSV();
      streams.push(tr);
    }
    // if('meta' in chunk && chunk.meta.archive === true) {
    //   streams.push(new TransformToCSV().push(chunk.data));
    //   createGzip().push(Buffer.from(JSON.stringify(chunk.data)));
    // }
    streams.push(() => void 0);
    console.log({chunk, streams});
    this.push(pipeline(...streams));
    done();
  }
}

const validateSocketConfig = (config) => {
  const errors = [];
  if(config?.meta?.format && config.meta.format !== 'csv') {
    errors.push(`meta.format must be "csv", received: ${config.meta.format}`);
  }

  if(config?.meta?.archive && typeof config.meta.archive !== 'boolean') {
    errors.push(`meta.archive must be boolean, received: ${config.meta.archive}`);
  }

  return errors.join(';' + os.EOL);
}

server.on('connection', (socket) => {
  socket.on('data', async (messageBuffer) => {
    try {
      socket.setEncoding('utf8');
      const message = JSON.parse(messageBuffer.toString());

      const errors = validateSocketConfig(message);

      if(errors.length) {
        socket.write(errors);
        throw new Error(errors);
      }

      const streams = [
        createReadStream(path.join(getDirname(), '../..', 'users.json')),
        JSONStream.parse('*'),
        new FilterDataStream(message),
      ];

      if('meta' in message && message.meta.format === 'csv') {
        streams.push(new TransformToCSV());
      }

      if('meta' in message && message.meta.archive === true) {
        streams.push(createGzip());
      }

      pipeline(
        ...streams,
        socket,
        (error) => console.error(error),
      );
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

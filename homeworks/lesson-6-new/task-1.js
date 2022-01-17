import { Readable, Transform, pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import os from 'os';

class JSONToCSV extends Transform {
  constructor(settings) {
    super(settings);
  }

  _transform(chunk, encoding, done) {
    const parsedJSON = JSON.parse(chunk.toString());
    const headers = Object.keys(parsedJSON[ 0 ]).join(';') + os.EOL;

    const res = parsedJSON.reduce((acc, curr) => {
      return acc + Object.values(curr).join(';') + os.EOL;
    }, headers);

    this.push(res);
    // console.log({ parsedJSON, res });
    done();
  }
}

const throwError = (error) => {
  if (error) {
    throw error;
  }
};

pipeline(
  createReadStream('./storage/randomDataSimple.json', throwError),
  new JSONToCSV({ objectMode: true }),
  createWriteStream('./storage/randomDataSimple.csv.gz', throwError),
  throwError,
);
//
// readFile('./storage/randomData.csv', { encoding: 'utf8' })
//   .then((res) => console.log(res.split(';')));
//

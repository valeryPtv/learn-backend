import { Transform, pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import os from 'os';

class JSONToCSV extends Transform {
  constructor(keptFields, settings) {
    super(settings);
    this._keptFields = keptFields;
  }

  _transform(chunk, encoding, done) {
    const parsedJSON = JSON.parse(chunk.toString());
    const filteredInput = parsedJSON.map((entity) => {
      return Object.fromEntries(Object.entries(entity).filter(([ key ]) => this._keptFields.includes(key)));
    });

    const headers = Object.keys(filteredInput[ 0 ]).join(';') + os.EOL;

    const res = filteredInput.reduce((acc, curr) => {
      return acc + Object.values(curr).join(';') + os.EOL;
    }, headers);

    this.push(res);
    console.log({ res });
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
  new JSONToCSV([ 'postId', 'name' ], { objectMode: true }),
  createWriteStream('./storage/randomDataSimple.csv', throwError),
  throwError,
);
//
// readFile('./storage/randomData.csv', { encoding: 'utf8' })
//   .then((res) => console.log(res.split(';')));
//

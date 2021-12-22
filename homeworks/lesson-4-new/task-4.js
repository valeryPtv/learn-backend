const { Readable, Transform, pipeline } = require('stream');
const path = require('path');


class UI extends Readable {
  constructor(data, settings) {
    super(settings);

    this.validateInput(data);
    this._data = data;
  }

  _read() {
    this.push(this._data ? this._data : null);
  }

  validateInput(data) {
    const { algorithm } = data.meta;
    if (algorithm === 'hex' || algorithm === 'base64') {
      return;
    }
    this.emit('error', `Algorithm must be hex or base64, received: ${algorithm}`);
  }
}

class Decryptor extends Transform {
  constructor(settings) {
    super(settings);
  }

  _transform(chunk, encoding, done) {
    const { payload } = chunk;
    this.push({
      name:     payload.name,
      email:    Buffer.from(payload.email, chunk.meta.algorithm).toString('utf8'),
      password: Buffer.from(payload.password, chunk.meta.algorithm).toString('utf8'),
    });
    done();
  }
}

const settings = {
  objectMode:    true,
  decodeStrings: false,
};

const data = {
  payload: {
    name:     'Pitter Black',
    email:    '70626c61636b40656d61696c2e636f6d',
    password: '70626c61636b5f313233',
  },
  meta: {
    algorithm: 'hex',
  },
};

const result = pipeline(
  new UI(data, settings),
  new Decryptor(settings),
  (error) => {
    error && console.error(error);
  },
);

// console.log({ result });

console.log({ __dirname, __filename: path.format(path.parse(__filename)) });

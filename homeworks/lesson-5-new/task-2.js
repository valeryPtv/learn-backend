import { Readable, Transform, Writable, pipeline } from 'stream';
import { scrypt, randomFill, createCipheriv, createDecipheriv, createSign, createVerify } from 'crypto';
import { promisify } from 'util';
import { readFile } from 'fs/promises';

// Constants
const keyPassword = 'password';
const algorithm = 'aes192';
const signText = 'Sign text';

let key = null;
let iv = null;

const scryptAsync = promisify(scrypt);
const randomFillAsync = promisify(randomFill);

const keysInitPromise = (async () => {
  try {
    key = await scryptAsync(keyPassword, 'salt', 24);
    iv = await randomFillAsync(Buffer.alloc(16), 10);
  } catch (error) {
    console.error(error);
  }
})();

const certsPromise = Promise.all([
  readFile('./cert/server-key.pem'),
  readFile('./cert/server-cert.pem'),
]);

const fieldsSchema = Object.freeze({
  name:     'string',
  email:    'string',
  password: 'string',
});

class UI extends Readable {
  constructor(settings, data) {
    super(settings);
    if (UI.validateFields(data)) {
      this._data = data;
    }
  }

  static validateFields(data) {
    let errorTexts = [];

    return data.every((dataItem) => {
      Object.entries(dataItem).forEach(([ key, value ]) => {
        if (!(key in fieldsSchema)) {
          errorTexts.push(`there is no ${key} in schema`);
        }
        if (typeof value !== fieldsSchema[ key ]) {
          errorTexts.push(`key: ${key} must have type of ${fieldsSchema[ key ]}`);
        }
      });

      Object.keys(fieldsSchema).forEach((key) => !(key in dataItem) && errorTexts.push(`Data must have ${key} field`));

      if (errorTexts.length) {
        this.emit('error', errorTexts.join(';\n'));

        return false;
      }

      return true;
    });
  }

  _read() {
    const chunk = this._data.shift();
    this.push(chunk ?? null);
  }
}

class Guardian extends Transform {
  constructor(settings) {
    super(settings);
  }

  async _encypt(data) {
    try {
      await keysInitPromise;
      const cipher = createCipheriv(algorithm, key, iv);

      return cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');
    } catch (error) {
      console.error('Error in Guardian _encrypt()', error);
    }
  }

  async _createSignature() {
    try {
      const [ serverKey ] = await certsPromise;
      const signInstance = createSign('RSA-SHA256');
      signInstance.update(signText);
      signInstance.end();

      return signInstance.sign(serverKey, 'hex');
    } catch (error) {
      console.error('Error in Guardian _createSignature()', error);
    }
  }

  _transform(chunk, encoding, done) {
    (async () => {
      try {
        this.push({
          meta: {
            source:    'ui',
            signature: await this._createSignature(),
          },
          payload: {
            name:     chunk.name,
            email:    await this._encypt(chunk.email),
            password: await this._encypt(chunk.password),
          },
        });
        done();
      } catch (error) {
        console.error('Error in Guardian _transformHandler', error);
      }
    })();
  }
}

class AccountManager extends Writable {
  constructor(settings) {
    super(settings);
  }

  _write(chunk, encoding, done) {
    (async () => {
      const { name, email, password } = chunk.payload;
      // console.log({ writeChunk: chunk });
      // console.log({ chunk, email, password });

      const result = {
        meta: {
          ...chunk.meta,
          isSignatureVerified: await this._verifySignature(chunk.meta.signature),
        },
        payload: {
          name:     name,
          email:    await this._decodeField(email),
          password: await this._decodeField(password),
        },
      };

      console.log('decrypted result', result);

      // this.push(result);
      done();
    })();
  }

  async _verifySignature(signature) {
    try {
      const [ _, serverCert ] = await certsPromise;

      const verifyInstance = createVerify('RSA-SHA256');
      verifyInstance.update(signText);

      return verifyInstance.verify(serverCert, signature, 'hex');
    } catch (error) {
      console.error('Error in AccountManager _verifySignature()', error);
    }
  }

  async _decodeField(cryptedData) {
    try {
      await keysInitPromise;
      const decipher = createDecipheriv(algorithm, key, iv);

      return decipher.update(cryptedData, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
      console.error('Error in AccountManager _decodeField', error);
    }
  }
}

const baseSettings = {
  objectMode:   true,
  decodeString: false,
};

const customers = [
  {
    name:     'Pitter Black',
    email:    'pblack@email.com',
    password: 'pblack_123',
  },
  {
    name:     'Oliver White',
    email:    'owhite@email.com',
    password: 'owhite_456',
  },
];

const result = pipeline(
  new UI({ ...baseSettings, highWaterMark: 10 }, customers),
  new Guardian(baseSettings),
  new AccountManager({ ...baseSettings, highWaterMark: 16 }),
  (error) => {
    if (error) {
      console.error('error');
    }
  },
);


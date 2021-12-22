const { Readable, Transform, Writable, pipeline } = require('stream');
const EventEmitter = require('events');

class UI extends Readable {
  constructor(data, settings) {
    super(settings);
    if (UI.validateFields(data)) {
      this._data = data;
    }
  }

  static validateFields(data) {
    const fieldsSchema = Object.freeze({
      name:     'string',
      email:    'string',
      password: 'string',
    });
    let errorTexts = [];

    Object.entries(data).forEach(([ key, value ]) => {
      if (!(key in fieldsSchema)) {
        errorTexts.push(`there is no ${key} in schema`);
      }
      if (typeof value !== fieldsSchema[ key ]) {
        errorTexts.push(`key: ${key} must have type of ${fieldsSchema[ key ]}`);
      }
    });

    Object.keys(fieldsSchema).forEach((key) => !(key in data) && errorTexts.push(`Data must have ${key} field`));

    if (errorTexts.length) {
      this.emit('error', errorTexts.join(';\n'));

      return false;
    }

    return true;
  }

  _read() {
    if (!this._data) {
      this.push(null);

      return;
    }

    this.push(this._data);
    this._data = null;
  }
}

class Guardian extends Transform {
  constructor(settings) {
    super(settings);
  }

  static stringToHex(string) {
    return Buffer.from(string, 'utf-8').toString('hex');
  }

  _transform(data, encoding, done) {
    this.push({
      meta: {
        source: 'ui',
      },
      payload: {
        name:     data.name,
        email:    Guardian.stringToHex(data.email),
        password: Guardian.stringToHex(data.password),
      },
    });

    done();
  }
}

class DB extends EventEmitter {
  constructor() {
    super();
    if (typeof DB.instance !== 'undefined') {
      this.emit('error', 'Attempt to create new DB instance, DB must be singleton');

      return;
    }

    this._dbData = null;
    this.on('save', this._handleSave);

    DB.instance = this;

    return DB.instance;
  }

  _handleSave(data) {
    console.log('DB writes: ');
    console.log(data);
    this._dbData = data;
  }
}

const DBSingletone = new DB();

class Logger extends Transform {
  constructor(settings) {
    super(settings);
  }

  _transform(chunk, encoding, done) {
    this.push(chunk);
    DBSingletone.emit('save', {
      ...chunk,
      created: new Date().toISOString(),
    });
    done();
  }
}

class AccountManager extends Writable {
  constructor(settings) {
    super(settings);
  }

  _write(chunk, encoding, done) {
    // ''
    console.log('Account manager chunk payload: ');
    console.log(chunk.payload);
    done();
  }
}

const source = {
  name:     'Pitter Black',
  email:    'pblack@email.com',
  password: 'pblack_123',
};

const baseSettings = {
  objectMode:   true,
  decodeString: false,
};

const data = pipeline(
  new UI(source, baseSettings),
  new Guardian(baseSettings),
  new Logger(baseSettings),
  new AccountManager(baseSettings),
  (error) => {
    if (error) {
      console.error(error);
    }
  },
);
/*
// Было {
  name: 'Pitter Black',
  email: 'pblack@email.com',
  password: 'pblack_123'
}
  Стало
  {
    meta: {
        source: 'ui'
    },
    payload: {
        name: 'Pitter Black',
        email: '70626c61636b40656d61696c2e636f6d',
        password: '70626c61636b5f313233'
      }
    }
 */

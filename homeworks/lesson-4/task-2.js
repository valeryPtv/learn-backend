const { Readable, Writable, Transform} = require('stream');

class UI extends Readable {
    constructor(data, options = {}) {
        super({
            objectMode: true,
            ...options
            // highWaterMark: 1,
            // encoding: 'utf8',
        });
        this._data = data;
        this._validateInput(data);
        this.init();
    }
    _read() {
        const item = this._data.shift();
        this.push(item);
    }
    _dataHandler() {

    }
    init() {
        this.on('data', this._dataHandler)
    }
    _validateInput(inputData) {
        const requiredFields = ['name', 'email', 'password'];
        inputData.forEach((inputItem) => {
            // console.log(inputItem);
            const isRequiredFieldsPresent = requiredFields.every((requiredField) => requiredField in inputItem);
            if (!isRequiredFieldsPresent) {
                throw new Error(`Fields: ${requiredFields.join(', ')} must be present in input`);
            }

            const areAllValuesStrings = Object.values(inputItem).every((inputValue) => typeof inputValue === 'string');
            if (!areAllValuesStrings) {
                throw new Error('All input values must be strings')
            }

            const areAdditionalFieldsPresent = Object.keys(inputItem).some((inputDataKey) => !requiredFields.includes(inputDataKey));
            if (areAdditionalFieldsPresent) {
                throw new Error(`Remove additional fields, only: ${requiredFields.join(', ')} must be present in input`);
            }
        })
    }
}

class Guardian extends Transform {
    constructor(options = {}) {
        super({
            objectMode: true,
            ...options,
            // highWaterMark: 1,
            // decodeStrings: false,
        });
    }
    _transform(chunk, encoding, done) {
        if(!chunk) {
            return;
        }

        const { name, email, password } = chunk;

        this.push({
            meta: {
                source: 'ui'
            },
            payload: {
                name,
                email: this._stringToHex(email),
                password: this._stringToHex(password)
            }
        });
        done();
    }
    _stringToHex(string) {
        return new Buffer.from(string).toString('hex');
    }
}

class AccountManager extends Writable {
    constructor(options = {}) {
        super({
            objectMode: true,
            ...options,
            // highWaterMark: 1,
            // readableObjectMode: true,
            // decodeStrings: false,
        });
        // this._init();
    }
    _write(chunk, encoding, done) {
        console.log('chunk', chunk.payload);
        done();
    }
    // _init() {
    //     this.on('drain', this._drainHandler);
    // }
    // _drainHandler(...args) {
    //     console.log('drain event', args);
    // }
}

const customers = [
    {
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123'
    },
    {
        name: 'Oliver White',
        email: 'owhite@email.com',
        password: 'owhite_456'
    }
];

const ui = new UI(customers);
const guardian = new Guardian();
const manager = new AccountManager();
ui.pipe(guardian).pipe(manager);

const { Readable, Transform, Writable, pipeline } = require('stream');
const { SERVER_KEY, SERVER_CERT } = process.env;

// Helpers
const { getIsChunkStructureCorrect } = require('../helpers');
const { promisify } = require('util');

// Crypto
const {
    scrypt,
    randomFill,
    createCipheriv,
    createDecipheriv,
    createSign,
} = require('crypto');

const scryptAsync = promisify(scrypt);
const randomFillAsync = promisify(randomFill);

const streamDefaultOptions = {
    objectMode: true,
};

const getCryptInfoWrapper = () => {
    let cryptInfo = null;

    return async () => {
        const password = 'Password used to generate key';

        try {
            const salt = await randomFillAsync(Buffer.alloc(10));
            const key = await scryptAsync(password, salt, 24);
            const initializationVector = await randomFillAsync(new Uint8Array(16));

            if (!cryptInfo) {
                cryptInfo = {
                    algorithm: 'aes-192-cbc',
                    password,
                    key,
                    initializationVector,
                };
            }

            return cryptInfo;
        } catch (error) {
            console.error(error);
        }
    };
};

const getCryptInfo = getCryptInfoWrapper();

class CustomerValidator extends Transform {
    static get _customerSchema() {
        return {
            name:     'string',
            email:    'string',
            password: 'string',
        };
    }

    static validate(customers) {
        const isStructureCorrect = customers.every((customerInput) => {
            return getIsChunkStructureCorrect(customerInput, CustomerValidator._customerSchema);
        });
        if (!isStructureCorrect) {
            throw new Error(
                `Customer must have structure as: \n${JSON.stringify(CustomerValidator._customerSchema, null, 2)}`,
            );
        }
    }
}

class UI extends Readable {
    constructor(initialData = null, options = {}) {
        super({
            ...streamDefaultOptions,
            ...options,
        });
        CustomerValidator.validate(initialData);
        this._data = initialData;
    }

    _read() {
        const dataItem = this._data.shift();
        this.push(dataItem || null);
    }
}

class Guardian extends Transform {
    constructor(options = {}) {
        super({
            ...streamDefaultOptions,
            ...options,
        });
    }

    static async _encryptString(string) {
        const { algorithm, key, initializationVector } = await getCryptInfo();

        const cipher = createCipheriv(algorithm, key, initializationVector);
        let encrypted = cipher.update(string, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // cipher.update(data[, inputEncoding][, outputEncoding])

        return encrypted;
    }

    static _sign(string) {
        const sign =
    }

    async _transform(chunk, encoding, done) {
        const encryptedChunk = {
            meta: {
                source: 'ui',
            },
            payload: {
                ...chunk,
                email:    await Guardian._encryptString(chunk.email),
                password: await Guardian._encryptString(chunk.password),
            },
        };
        this.push(encryptedChunk);
        done();
    }
}

class AccountManager extends Writable {
    constructor(options = {}) {
        super({
            ...streamDefaultOptions,
            ...options,
        });
    }

    async _write(chunk, encoding, done) {
        const { name, email, password } = chunk.payload;

        const decrypted = {
            name,
            email:    await AccountManager._decryptString(email),
            password: await AccountManager._decryptString(password),
        };
        console.log({ decrypted });

        done();
    }

    static async _decryptString(encryptedString) {
        const { algorithm, key, initializationVector } = await getCryptInfo();
        const decipher = createDecipheriv(algorithm, key, initializationVector);

        let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

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
    {
        name:     'Oliver White',
        email:    'owhite@email.com',
        password: 'owhite_456',
    },
];

const ui = new UI(customers);
const guardian = new Guardian();
const manager = new AccountManager();

pipeline(ui,
    guardian,
    manager,
    (error) => {
        if (error) {
            console.error('Pipeline failed', error);
        }
    });


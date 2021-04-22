const { Readable, Transform, Writable } = require('stream');

const isObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null;

class UI extends Readable {
    constructor(initialData, options = {}) {
        super({
            objectMode: true,
            ...options,
        });
        this._data = initialData;
    }
    _read() {
        const dataItem = this._data.shift();
        this.push(dataItem || null);
    }
}

class Decryptor extends Transform {
    constructor(options = {}) {
        super({
            objectMode: true,
            ...options,
        });
    }

    static get _chunkStructure() {
        return {
            payload: {
                name: 'string',
                email: 'string',
                password: 'string',
            },
            meta: {
                algorithm: 'string'
            }
        };
    }

    _transform(chunk, encoding, done) {
        const decryptedData = this._decrypt(chunk);
        this.push(decryptedData);
        done();
    }

    _decrypt(chunk) {
        Decryptor._validateChunk(chunk);
        const { payload: { name, email, password }, meta: { algorithm }} = chunk;
        const encode = (value) => Buffer.from(value, 'hex').toString(algorithm);

        return {
            name,
            email: encode(email),
            password: encode(password)
        }
    }

    static _validateChunk(chunk) {
        const { algorithm } = chunk.meta;
        if (algorithm !== 'hex' && algorithm !== 'base64') {
            throw new Error(`Algorithm is ${algorithm}, it must be hex or base64`);
        }

        const isChunkStructureCorrect = Decryptor._getIsChunkStructureCorrect(chunk);
        if (!isChunkStructureCorrect) {
            throw new Error(`Chunk structure must be the same as:\n ${JSON.stringify(Decryptor._chunkStructure, null, 2)}`);
        }
    }

    static _getIsChunkStructureCorrect (chunk, chunkSchema = Decryptor._chunkStructure) {
        const chunkValidation = Object.entries(chunk).every(([key, value]) => {
            if (isObject(value) && chunkSchema[key]) {
                return Decryptor._getIsChunkStructureCorrect(value, chunkSchema[key]);
            }

            const doesSchemaHaveKey = key in chunkSchema;
            return value || doesSchemaHaveKey || typeof value === typeof chunkSchema[key]
        });

        const doesChunkHaveAllKeys = Object.keys(chunkSchema).every((key) => key in chunk);

        return chunkValidation && doesChunkHaveAllKeys;
    }
}

class AccountManager extends Writable {
    constructor(options = {}) {
        super({
            objectMode: true,
            ...options,
        });
    }
    _write(chunk, encoding, done) {
        console.log('chunk', chunk);
        done();
    }
}

const customers = [
    {
        payload: {
            name: 'Pitter Black',
            email: '70626c61636b40656d61696c2e636f6d',
            password: '70626c61636b5f313233',
        },
        meta: {
            algorithm: 'hex'
        }
    }
];

const ui = new UI(customers);
const decryptor = new Decryptor();
const manager = new AccountManager();
ui.pipe(decryptor).pipe(manager);

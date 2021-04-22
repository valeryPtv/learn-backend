const EventEmitter = require('events');

/**
 * @typedef IData
 * IData.source: string,
 * IData.payload: object,
 * IData.created: Date
 */

class DB extends EventEmitter {
    constructor() {
        super();
        if (DB._instance) {
            console.warn('WARN: You are creating a new DB instance which is singleton');
            return DB._instance;
        }
        this._storage = new Map();
        this._init();
        DB._instance = this;
    }
    /**
     * @param {IData} data
     */
    _saveHandler(data) {
        const { meta, payload } = data;
        const id = (Math.random() * 10000000000).toFixed(0);
        const newDbEntry = {
            source: meta.source,
            payload,
            created: Date.now()
        };
        this._storage.set(id, newDbEntry);
    }
    _init() {
        this.on('save', this._saveHandler);
    }
}

module.exports = new DB();


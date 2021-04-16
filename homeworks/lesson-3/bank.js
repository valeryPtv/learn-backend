const EventEmitter = require('events');
const { v4 } = require('uuid');

class Bank extends EventEmitter {
    constructor() {
        super();
        this._clients = {};
        this.on('add', this._addHandler);
        this.on('get', this._getHandler);
        this.on('withdraw', this._withdrawHandler);
    }

    _checkIfClientExists(clientId) {
        if (!this._clients[clientId]) {
            this.emit('error', `There is no client ${clientId} in the bank`);
        }
    }

    _addHandler(clientId, sumToAdd) {
        this._checkIfClientExists(clientId);
        if (sumToAdd <= 0) {
            this.emit('error', 'Sum to add must be > 0');
        }
        this._clients = {
            ...this._clients,
            [clientId]: {
                ...this._clients[clientId],
                balance: this._clients[clientId].balance + sumToAdd
            }
        }
    }

    _getHandler(clientId, callback) {
        this._checkIfClientExists(clientId);
        callback(this._clients[clientId].balance);
    }

    _withdrawHandler(clientId, moneyToWithdraw) {
        this._checkIfClientExists(clientId);
        const currentClientBalance = this._clients[clientId].balance;
        if (moneyToWithdraw <= 0) {
            this.emit('error', 'Amount for withdraw must be > 0')
        }
        if (moneyToWithdraw > currentClientBalance) {
            this.emit('error', 'It`s impossible to withdraw more than its');
        }
        this._clients[clientId].balance -= moneyToWithdraw;
    }

    /**
     *
     * @param {{name: string, balance: number}} clientData
     * @returns string | null
     */
    register(clientData) {
        const isInputNameNotUnique = Object.values(this._clients).some((existingClient) => existingClient.name === clientData.name);
        if (isInputNameNotUnique) {
            this.emit('error', 'Client input name is not unique');
        } else if (clientData.balance <= 0) {
            this.emit('error', 'Client`s initial balance must be > 0')
        } else {
            const clientId = v4();
            this._clients[clientId] = clientData;

            return clientId;
        }

        return null;
    }

    get clients() {
        return Object.freeze(this._clients);
    }
}

const bank = new Bank();
const personId = bank.register({
    name: 'Pitter Black',
    balance: 100
});
bank.emit('add', personId, 20);
bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});
bank.emit('withdraw', personId, 50);
bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 70₴
});

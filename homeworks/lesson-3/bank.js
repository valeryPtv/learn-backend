const EventEmitter = require('events');
const { v4 } = require('uuid');

class Bank extends EventEmitter {
  constructor() {
    super();
    this._clients = new Map();
    this.on('add', this._addHandler);
    this.on('get', this._getHandler);
    this.on('withdraw', this._withdrawHandler);
    this.on('send', this._sendHandler);
    this.on('changeLimit', this._changeLimitHandler);
    this.on('error', this._emitterErrorHandler);
  }

  _checkIfClientExists(clientId) {
    if (!this._clients.has(clientId)) {
      this.emit('error', new Error(`There is no client ${clientId} in the bank`));
    }
  }

  /**
     * @param {string} clientId
     * @param {any} value
     * @param {string | null | undefined} field
     * @private
     */
  _setClient(clientId, field, value) {
    const clientOld = this._clients.get(clientId);
    if (field) {
      this._clients.set(clientId, {
        ...clientOld,
        field: value,
      });
    } else {
      this._clients.set(clientId, value);
    }
  }

  /**
     * @param {string} clientId
     * @param {number} sumToAdd
     * @private
     */
  _addHandler(clientId, sumToAdd) {
    this._checkIfClientExists(clientId);
    if (sumToAdd <= 0) {
      this.emit('error', new Error('Sum to add must be > 0'));
    }
    const clientOld = this._clients.get(clientId);
    this._setClient(clientId, 'balance', clientOld.balance + sumToAdd);
  }

  /**
     * @param {string} clientId
     * @param {function} callback
     * @private
     */
  _getHandler(clientId, callback) {
    this._checkIfClientExists(clientId);
    callback(this._clients.get(clientId).balance);
  }

  /**
     * @param {string} clientId
     * @param {number} moneyToWithdraw
     * @private
     */
  _withdrawHandler(clientId, moneyToWithdraw) {
    this._checkIfClientExists(clientId);
    const client = this._clients.get(clientId);

    if (moneyToWithdraw <= 0) {
      this.emit('error', new Error('Amount for withdraw must be > 0'));
    }
    if (moneyToWithdraw > client.balance) {
      this.emit('error', new Error('Impossible to withdraw more than it is in account'));
    }
    if (client.limit && !client.limit(moneyToWithdraw)) {
      this.emit('error', new Error(`Impossible to due to limit, money to send: ${moneyToWithdraw}`));
    }

    this._setClient(clientId, 'balance', client.balance - moneyToWithdraw);
  }

  /**
     *
     * @param {string} senderId
     * @param {string} receiverId
     * @param {number} moneyToSend
     * @private
     */
  _sendHandler(senderId, receiverId, moneyToSend) {
    this._checkIfClientExists(senderId);
    this._checkIfClientExists(receiverId);
    const sender = this._clients.get(senderId);
    const receiver = this._clients.get(receiverId);

    if (moneyToSend <= 0) {
      this.emit('error', new Error('Sending moneyToSend must be > 0'));
    }
    if (moneyToSend > sender.balance) {
      this.emit('error', new Error('It`s impossible to send more than sender has'));
    }
    if (sender.limit && !sender.limit(moneyToSend)) {
      this.emit('error', new Error(`Impossible to due to limit, money to send: ${moneyToSend}`));
    }

    this._setClient(senderId, 'balance', sender.balance - moneyToSend);
    this._setClient(receiverId, 'balance', receiver.balance + moneyToSend);
  }

  /**
     * @param {string} clientId
     * @param callback {function(amount: number, currentBalance: number, updatedBalance: number)}
     * @private
     */
  _changeLimitHandler(clientId, callback) {
    this._checkIfClientExists(personId);
    this._setClient(clientId, 'limit', (amount) => {
      const currentBalance = this._clients.get(clientId).balance;
      const updatedBalance = currentBalance - amount;

      return callback(amount, currentBalance, updatedBalance);
    });
  }

  _emitterErrorHandler(error) {
    console.log('Catch emitter error:', error);
  }

  /**
     * @param {{name: string, balance: number, limit?: function}} clientData
     * @returns string | null
     */
  register(clientData) {
    const isInputNameNotUnique = Array.from(this._clients.values()).some((existingClient) => existingClient.name === clientData.name);
    if (isInputNameNotUnique) {
      this.emit('error', new Error('Client input name is not unique'));
    } else if (clientData.balance <= 0) {
      this.emit('error', new Error('Client`s initial balance must be > 0'));
    } else {
      const clientId = v4();
      this._setClient(clientId, null, {
        ...clientData,
        limit: clientData.limit || null,
      });

      return clientId;
    }

    return null;
  }

  destroy() {
    this.removeAllListeners();
    // this.off('add', this._addHandler);
    // this.off('get', this._getHandler);
    // this.off('withdraw', this._withdrawHandler);
    // this.off('send', this._sendHandler);
    // this.off('changeLimit', this._changeLimitHandler);
    // this.off('error', this._emitterErrorHandler);
  }
}

const bank = new Bank();
const personId = bank.register({
  name:    'Pitter Black',
  balance: 100,
});
bank.emit('add', personId, 20);
bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}₴`); // I have 120₴
});
bank.emit('withdraw', personId, 50);
bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}₴`); // I have 70₴
});

// 2nd task

const personFirstId = bank.register({
  name:    'Pitter Green',
  balance: 100,
});
const personSecondId = bank.register({
  name:    'Oliver White',
  balance: 700,
});
bank.emit('send', personFirstId, personSecondId, 50);
bank.emit('get', personSecondId, (balance) => {
  console.log(`I have ${balance}₴`); // I have 750₴
});

// 3rd task

const personId3 = bank.register({
  name:    'Bruce Dickinson',
  balance: 700,
  limit:   (amount) => amount < 10,
});
bank.emit('withdraw', personId3, 5);
bank.emit('get', personId3, (amount) => {
  console.log(`I have ${amount}₴`); // I have 695₴
});
// Вариант 1
bank.emit('changeLimit', personId3, (amount, currentBalance, updatedBalance) => {
  return amount < 100 && updatedBalance > 700;
});
bank.emit('withdraw', personId3, 5); // Error
// Вариант 2
bank.emit('changeLimit', personId3, (amount, currentBalance, updatedBalance) => {
  return amount < 100 && updatedBalance > 700 && currentBalance > 800;
});
// Вариант 3
bank.emit('changeLimit', personId3, (amount, currentBalance) => {
  return currentBalance > 800;
});
// Вариант 4
bank.emit('changeLimit', personId3, (amount, currentBalance, updatedBalance) => {
  return updatedBalance > 900;
});
bank.emit('withdraw', personId3, 500);
bank.emit('get', personId3, (balance) => {
  console.log(`I have ${balance}₴`); // I have 750₴
});
bank.destroy();

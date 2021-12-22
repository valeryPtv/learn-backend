const EventEmmiter = require('events');

class Bank extends EventEmmiter {
  constructor() {
    super();
    this._customers = [];
    this.on('add', this._handleAddFunds);
    this.on('get', this._get);
    this.on('withdraw', this._handleWithdraw);
    // this.on('error', (error) => {
    //   throw new Error(error);
    // });
  }

  register(newCustomer) {
    if (this._customers.find((existingCustomer) => existingCustomer.name === newCustomer.name)) {
      this.emit('error', `Customer ${newCustomer.name} is already added`);
    }
    if (newCustomer.balance <= 0) {
      this.emit('error', `New customer must have balance > 0, customer which is going to be added ${newCustomer}`);
    }
    this._customers.push(newCustomer);

    return newCustomer.name;
  }

  _handleAddFunds(customerName, fundsAmount) {
    if (fundsAmount <= 0) {
      this.emit('error', `Funds amount to add must be > , attempting to add ${fundsAmount} for ${customerName}`);
    }
    if (!this._findCustomer(customerName)) {
      return;
    }

    this._customers = this._customers.map((existingCustomer) => {
      return existingCustomer.name === customerName ? {
        ...existingCustomer,
        balance: existingCustomer.balance + fundsAmount,
      } : existingCustomer;
    });
  }

  _get(customerName, callback) {
    const foundCustomer = this._findCustomer(customerName);
    if (!foundCustomer) {
      return;
    }
    callback(foundCustomer.balance);
  }

  _handleWithdraw(customerName, fundsAmount) {
    const customer = this._findCustomer(customerName);
    if (!customer) {
      return;
    }
    if (fundsAmount > customer.balance) {
      this.emit('error', `Can't withdraw more than customer has, attempting to withdraw ${fundsAmount} from ${customerName}`);
    }
    if (fundsAmount <= 0) {
      this.emit('error', `Can't withdraw <= 0, attempting to withdraw ${fundsAmount} from ${customerName}`);
    }

    this._customers = this._customers.map((existingCustomer) => {
      return existingCustomer.name === customerName ? {
        ...existingCustomer,
        balance: existingCustomer.balance - fundsAmount,
      } : existingCustomer;
    });
  }

  _findCustomer(name) {
    const foundCustomer = this._customers.find((existingCustomer) => existingCustomer.name === name);
    console.log({ name, foundCustomer });
    if (!foundCustomer) {
      this.emit('error', `Customer ${name} doesn't exist`);
    }

    return foundCustomer;
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

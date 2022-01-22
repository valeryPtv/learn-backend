const EventEmitter = require('events');

class Bank extends EventEmitter {
    constructor() {
        super();

        this.customers = [];

        this.on('add', (personId, amount) => this._enroll(personId, amount));

        this.on('error', ({ message }) => {
            throw new Error(message);
        });
    }

    register(customer) {
        this._checkForDuplicates(customer);

        const id = Date.now() + Math.floor(Math.random() * 10);
        customer.id = id;

        this.customers.push(customer);

        return id;
    }

    _checkForDuplicates(customer) {
        const isCustomerExists = this.customers.some(
            ({ name }) => customer.name === name
        );

        if (isCustomerExists) {
            this.emit(
                'error',
                new Error(`duplicated customer for name: '${customer.name}'`)
            );
        }
    }

    _enroll(personId, amount) {
        if (amount <= 0) {
            this.emit('error', new Error('amount should be greater than 0'));
        }

        const index = this.customers.findIndex(({ id }) => id === personId);

        if (index < 0) {
            console.log('not found');
            this.emit(
                'error',
                new Error(`customer with id '${personId}' not found`)
            );
            return;
        }

        const customer = this.customers[index];
        console.log({customer, bal: customer.balance});
        const balance = customer.balance + amount;

        this.customers[index] = { ...customer, balance };

        return balance;
    }
}

module.exports = { Bank };
// const bankInstance = new Bank();
// console.log({bankInstance});

// const id = bankInstance.register({ name: 'customer1', balance: 0 })
// const customer = bankInstance.customers.find((customer) => customer.id === id);
// const initialBalance = customer.balance;
// bankInstance.emit('add', id, 200);
// console.log({
//     initialBalance,
//     balanceNew: bankInstance.customers.find((customer) => customer.id === id).balance,
//     returnEmit: bankInstance.emit('add', id, 200),
//     customers: bankInstance.customers,
// });

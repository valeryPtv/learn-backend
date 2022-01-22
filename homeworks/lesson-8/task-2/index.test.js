const { Bank }  = require('./');
const EventEmitter = require('events');
jest.mock('events');

const bankInstance = new Bank();

describe('Bank tests', () => {
  test('Bank inherits EventEmitter', () => {
    expect(bankInstance).toBeInstanceOf(EventEmitter);
  });

  // Constructor
  describe('Bank initialisation', () => {
    const bankInstanceLocal = new Bank();
    test('Added add event to bank instance', () => {
      expect(bankInstanceLocal.on).toBeCalledWith('add', expect.any(Function));
    });
  });

  // Registration
  describe('Bank customer registration', () => {
    test('Bank instance register() returns id', () =>
      expect(bankInstance.register({})).toBeTruthy()
    );

    test('Bank instance register() id has type of number', () =>
      expect(typeof bankInstance.register({}) === 'number').toBeTruthy()
    );

    test('Bank instance register() returns unique id', () => {
      const bankInstanceLocal = new Bank();
      expect(bankInstanceLocal.register({}) === bankInstanceLocal.register({})).toBeFalsy()
    });

    test('Bank instance register() adds new customer', () => {
      const bankInstanceLocal = new Bank();
      const id = bankInstanceLocal.register({ name: 'customer1', balance: 0 });
      const addedCustomer = bankInstanceLocal.customers.find((customer) => customer.id === id);

      expect(bankInstanceLocal.customers.includes(addedCustomer)).toBeTruthy()
    });

  })
  // Add balance
  describe('Bank increase customer balance', () => {
    test('add event calls _enroll()', () => {
      expect(() => {
        const bankInstanceLocal = new Bank();
        const id = bankInstanceLocal.register({ name: 'customer1', balance: 0 });
        bankInstanceLocal.emit('add', id, 131);
        expect(bankInstanceLocal._enroll).toHaveBeenCalledWith(id, 131);
      })
    });

    test('Add balance event handler must accept two number arguments', () => {
      const bankInstanceLocal = new Bank();
      const id = bankInstanceLocal.register({ name: 'customer1', balance: 0 });

      expect(() => {
        bankInstanceLocal.emit('add', id, 200);
        bankInstanceLocal._enroll.toHaveBeenCalledWith(expect.any(Number), expect.any(Number))
      });
    });

    test('Can\'t add negative funds quantity to customers account', () => {
      const bankInstanceLocal = new Bank();
      const id = bankInstanceLocal.register({ name: 'customer17', balance: 0 });
      bankInstanceLocal._enroll(id, -123);
      expect(bankInstanceLocal.emit).toHaveBeenCalledWith('error', new Error('amount should be greater than 0'));
    });

    test('Can\'t add funds to not existing customer', () => {
      const bankInstanceLocal = new Bank();
      const randomId = Date.now() + Math.floor(Math.random() * 10);
      bankInstanceLocal._enroll(randomId, 123);
      expect(bankInstanceLocal.emit).toHaveBeenCalledWith('error', new Error(`customer with id '${randomId}' not found`));
    });
  })
});

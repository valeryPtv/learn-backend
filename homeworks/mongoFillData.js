// print('========= FILL ============');

const createCustomers = (amount = 10) => {
  const customers = [];
  for (let i = 0; i < amount; i++) {
    const first = faker.fName();
    const last = faker.lName();

    customers.push({
      name: {
        first,
        last,
        email: first + last + '@email.com'
      },
      nickname: first.toLowerCase() + '_' + last.toLowerCase(),
      balance: (Math.random() + 0.5 * 10000).toFixed(),
      created: new Date()
    })
  }

  return customers;
}

const createOrder = (customerId, orderIndex) => {
  const product = faker.product();
  return {
    customerId,
    price: Number((Math.random() * 80 + 20).toFixed()),
    count: Number((Math.random() * 100).toFixed()),
    discount: Number((Math.random() * 25 + 5).toFixed()),
    title: product + ' title',
    product: product + ' product',
  };
};

const init = (customersAmount = 10, maxOrdersAmount = 9) => {
  db.customers.drop();
  db.orders.drop();

  db.createCollection('customers');

  const newCustomers = createCustomers(customersAmount);
  db.customers.insertMany(newCustomers);

  db.createCollection('orders');

  const newOrders = [];

  db.customers.find().forEach(({_id}) => {
    const newArr = [];
    const amount = Number((Math.random() * maxOrdersAmount + 1).toFixed());
    for(let i = 0; i < amount; i++) {
      newArr.push(createOrder(_id, i))
    }

    newOrders.push(...newArr);
  });

  db.orders.insertMany(newOrders);
}


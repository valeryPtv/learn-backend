load('./random.js');
print('========= FILL ============');

const init = () => {
  db.customers.drop();
  db.orders.drop();

  db.createCollection('customers');

  const newCustomers = [];
  for (let i = 0; i < 10; i++) {
    newCustomers.push({
      name: {
        first: faker.fName(),
        last: faker.lName(),
        // first: i + ' customers\' first name',
        // last: i + ' customers\' last name',
      },
      balance: (Math.random() + 0.5 * 10000).toFixed(),
      created: new Date()
    })
  }

  db.customers.insertMany(newCustomers);

  db.createCollection('orders');


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

  const newOrders = [];

  db.customers.find().forEach(({_id}) => {
    const newArr = [];
    const amount = Number((Math.random() * 9 + 1).toFixed());
    for(let i = 0; i < amount; i++) {
      newArr.push(createOrder(_id, i))
    }

    newOrders.push(...newArr);
  });

  db.orders.insertMany(newOrders);
}


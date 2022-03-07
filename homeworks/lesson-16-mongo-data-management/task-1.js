use vpotapov;
db.customers.drop();
db.orders.drop();

db.createCollection('customers');

const newCustomers = [];
for (let i = 0; i < 10; i++) {
  newCustomers.push({
    name: {
      first: i + ' customers\' first name',
      first: i + ' customers\' last name',
    },
    balance: (Math.random() + 0.5 * 10000).toFixed(),
    created: new Date()
  })
}

db.customers.insertMany(newCustomers);

db.createCollection('orders');


const createOrder = (customerId, orderIndex) => ({
  customerId,
  price: Number((Math.random() * 80 + 20).toFixed()),
  count: Number((Math.random() * 100).toFixed()),
  discount: Number((Math.random() * 25 + 5).toFixed()),
  title: customerId + ' customer\'s ' + (orderIndex + 1 ) + ' title',
  product: customerId + ' customer\'s ' + (orderIndex + 1 ) + ' product',
})

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

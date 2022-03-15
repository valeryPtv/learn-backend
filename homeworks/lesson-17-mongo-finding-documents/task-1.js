use vpotapov;
load('../random.js');
load('../mongoFillData.js');
init();

const aggregated = db.customers.aggregate([
  {
    $project: { fName: '$name.first', lName: '$name.last' },
  },
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'customerId',
      as: 'orders'
    }
  },
  {
    $project: {
      fName: true,
      lName: true,
      orders: {
        _id: true,
        count: true,
        price: true,
        discount: true,
        product: true,
      }
      // 'orders._id': true,
      // 'orders.count': true,
      // 'orders.price': true,
      // 'orders.discount': true,
      // 'orders.product': true,
    }
  },
  { $limit: 1 }
]);

tojson(aggregated.toArray());
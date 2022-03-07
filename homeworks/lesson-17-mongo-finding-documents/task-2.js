use vpotapov;
load('../mongoFillData.js');
load('../random.js');
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
      as: 'orders',
      pipeline: [
        {
          $group: {
            _id: '$product',
            total: {
              $sum: 1
            }
          }
        },
      ]
    },
  },
  // {
  //   $project: {
  //     fName: true,
  //     lName: true,
  //     'orders._id': true,
  //     'orders.count': true,
  //     'orders.price': true,
  //     'orders.discount': true,
  //     'orders.product': true,
  //   }
  // },
  // { $limit: 3 }
]);

tojson(aggregated.toArray());

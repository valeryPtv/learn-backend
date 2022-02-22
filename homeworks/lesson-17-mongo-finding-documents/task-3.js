use vpotapov;
print('====== TASK 1 =======');
load('./fillData.js');
init();


const offset = 0;
const paginate = (size = 3, page = 0) => {
  return db.customers.aggregate([
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
    {$skip: page * size},
    {$limit: size},
  ]);
};

// tojson(paginate(3, 0).toArray());
tojson(paginate(4, 1).toArray());

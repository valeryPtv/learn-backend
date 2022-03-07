use vpotapov;
load('../mongoFillData.js');
load('../random.js');
// init(3, 3);

db.customers.dropIndexes();
db.customers.createIndex({
  'name.first': 'text',
  'name.last': 'text',
  'name.email': 'text'
});
// db.customers.createIndex({ '$**': 'text' });

db.customers.find(
  { $text: { $search: 'Benedict Wiegand' } },
  { score: { $meta: 'textScore' }, _id: false }
)

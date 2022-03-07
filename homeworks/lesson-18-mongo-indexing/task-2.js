use vpotapov;
load('../mongoFillData.js');
load('../random.js');
// init(3, 3);

db.customers.dropIndexes();
db.customers.createIndex({ 'name.first': 1, nickname: 1 }, { unique: 1 });

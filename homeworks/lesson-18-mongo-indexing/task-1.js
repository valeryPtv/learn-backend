use vpotapov;
load('../mongoFillData.js');
load('../random.js');
// init(200000, 10);

db.customers.dropIndex('email1');
db.customers.dropIndex('firstLastName');
db.customers.dropIndex('emailAndCreated');

print(tojson({
  customersCount: db.customers.stats().count,
}));

// Email
const statsEmail = JSON.parse(tojson(db.customers.find({'name.email': 'ArmandGrady@email.com'}).explain(true)));
print(`Find email without index: ${statsEmail.executionStats.executionTimeMillis} ms`);

db.customers.createIndex({ 'name.email': 1 }, {background: false, name: 'email1'});
const statsEmail2 = JSON.parse(tojson(db.customers.find({'name.email': 'ArmandGrady@email.com'}).explain(true)));
print(`Find email with index: ${statsEmail2.executionStats.executionTimeMillis} ms`);
print('=======================');

// Name first and last
const statsName = JSON.parse(tojson(db.customers.find({'name.first': 'Libby', 'name.last': 'Adams'}).explain(true)));
print(`Find first and last name without index: ${statsName.executionStats.executionTimeMillis} ms`);

db.customers.createIndex({ 'name.first': 1, 'name.last': 1 }, { background: false, name: 'firstLastName' });
const statsName2 = JSON.parse(tojson(db.customers.find({'name.first': 'Libby', 'name.last': 'Adams'}).explain(true)));
print(`Find first and last name with index: ${statsName2.executionStats.executionTimeMillis} ms`);
print('=======================');

// // Email and created
const statsEmailCreated = JSON.parse(tojson(db.customers
    .find({'name.email': 'TitusFisher@email.com', created: '2022-03-07T12:04:54.093+00:00'})
    .sort({ 'name.email': 1, created: 1 })
  .explain(true)));
print(`Find name.email and created without index: ${statsEmailCreated.executionStats.executionTimeMillis} ms`);

db.customers.createIndex({ 'name.email': 1, created: -1 }, { background: false, name: 'emailAndCreated' });

const statsEmailCreated2 = JSON.parse(tojson(db.customers
  .find({'name.email': 'TitusFisher@email.com', created: '2022-03-07T12:04:54.093+00:00'})
  .sort({ 'name.email': 1, created: 1 })
  .explain(true)));
print(`Find name.email and created with index: ${statsEmailCreated2.executionStats.executionTimeMillis} ms`);
print('=======================');

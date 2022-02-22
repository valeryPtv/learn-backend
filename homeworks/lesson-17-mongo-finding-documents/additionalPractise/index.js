use vpotapov;
// source: https://www.w3resource.com/mongodb-exercises/#PracticeOnline
//  1. Write a MongoDB query to display all the documents in the collection restaurants.
// db.restaurants.find();

// 2. 2. Write a MongoDB query to display the fields restaurant_id, name, borough and cuisine for all the documents in the collection restaurant.
// db.restaurants.find({}, {
//   restaurant_id: true,
//   name: true,
//   borough: true,
//   cuisine: true,
// })

// 3. Write a MongoDB query to display the fields restaurant_id, name, borough and cuisine, but exclude the field _id for all the documents in the collection restaurant.
// db.restaurants.find({}, {
//   _id: false,
//   restaurant_id: true,
//   name: true,
//   borough: true,
//   cuisine: true,
// })

// 4. Write a MongoDB query to display all the restaurant which is in the borough Bronx.
// db.restaurants.find({}, {
//   borough: 'Bronx',
// })

// 5. Write a MongoDB query to display the first 5 restaurant which is in the borough Bronx.
// db.restaurants.find({ borough: 'Bronx' }, { borough: true }).limit(5);

// 6. Write a MongoDB query to find the restaurants who achieved a score more than 90.
// db.restaurants.find({ 'grades.score': { $gt: 90 }}, {'grades.score.$': true})
// db.restaurants.find({grades : { $elemMatch:{"score":{$gt : 90}}}}, {'grades.score.$': true});

// 7. Write a MongoDB query to find the restaurants that achieved a score, more than 80 but less than 100.
// db.restaurants.find({ 'grades.score': {$elemMatch: { $gt : 80 , $lt :100}}}, {'grades.score': true})

// 8. Write a MongoDB query to find the restaurants that do not prepare any cuisine of 'American' and their grade score more than 70 and latitude less than -65.754168.
// db.restaurants.find({
//     cuisine: { $ne: 'American '},
//     // 'grades.score': { $elemMatch: { $gt: 480 } },
//     // 'grades.score': {$elemMatch: { $gt : 0 }},
//     grades: { $elemMatch:{"score":{$gt : 90}}},
//     'address.coord.0': { $lt: -65.754168 }
//   },
//   { 'grades.score': true, cuisine: true, 'address.coord': { $slice: 1} }
// );

// 9. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which contain 'ces' as last three letters for its name.
// db.restaurants.find({ name: /Diner$/gi }, { name: true, borough: true, cuisine: true})

// 20. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which prepared dish except 'American' and 'Chinees' or restaurant's name begins with letter 'Wil'.
// db.restaurants.find({ cousine: { $ne: { $or: ['American ', 'Chinese'] } } }, { restaurant_id: true, name: true, borough: true, cuisine: true})

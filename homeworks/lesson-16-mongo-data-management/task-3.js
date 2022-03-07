use vpotapov;
print('Amount of orders: ', db.orders.stats().count);
print('Size of orders data: ', db.orders.dataSize());
print('Size of customers data: ', db.customers.dataSize());
print('Size of customers and orders data: ', db.customers.dataSize() + db.orders.dataSize());

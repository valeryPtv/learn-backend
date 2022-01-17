import {Socket} from 'net';

const client = Socket();
const PORT = 8080;

client.connect(PORT, () => {
  console.log('Client connected');
  // client.write(JSON.stringify('dick'));

  const json = JSON.stringify(
    {
      name: {
        last: 'John'
      },
      // address: {
      //   city: 'Kyiv',
      // },
    }
    // {
    //   name: {
    //     first: 'John',
    //     last: 'd'
    //   },
    //   phone: '56',
    //   address: {
    //     zip: '1234',
    //     city: 'Kyiv',
    //     country: 'ukr',
    //     street: 'so'
    //   },
    //   email: '@gmail.com'
    // }
  );
  client.write(json);
});

client.on('data', (data) => {
  console.log('Client received: ', data.toString());
})

client.on('close', () => {
  console.log('Connection closed!');
});


// setTimeout(() => {}, 10000);

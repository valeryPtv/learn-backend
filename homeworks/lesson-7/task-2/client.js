import {Socket} from 'net';

const client = Socket();
const PORT = 8080;

client.connect(PORT, () => {
  console.log('Client connected');
  // client.write(JSON.stringify('dick'));

  const requestData = {
    filter: {
      name: {
        last: 'John'
      },
    },
    meta: {
      format: 'csv',
      archive: true,
    }
  };

  const json = JSON.stringify(
    {
      name: {
        first: 'Eloy'
      },
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

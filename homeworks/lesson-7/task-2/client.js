import {Socket} from 'net';

const client = Socket();
client.setEncoding('utf8');
const PORT = 8080;

client.connect(PORT, () => {
  console.log('Client connected');

  const requestData = {
    filter: {
      name: {
        last: 'John'
      },
    },
    meta: {
      format: 'csv',
      // archive: true,
    }
  };
  client.write(JSON.stringify(requestData));
});

client.on('data', (data) => {
  console.log('Client received: ', data);
})

client.on('close', () => {
  console.log('Connection closed!');
});

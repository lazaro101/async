const redis = require('redis');

var port = process.env.REDIS_PORT || 6379;  
var host = process.env.REDIS_HOST || '127.0.0.1';
const client = redis.createClient();

client.connect();

client.on('connect', function() {
  console.log('Redis Connected!');
});

client.on("error", (err) => {
    console.log(err);
});


module.exports = client;


// (async () => {
//   const client = createClient();

//   client.on('error', (err) => console.log('Redis Client Error', err));

//   await client.connect();

//   await client.set('key', 'value');
//   const value = await client.get('key');
// })();
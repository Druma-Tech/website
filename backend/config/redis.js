const { createClient } = require('redis');

const client = createClient({
    password: 'VvGC4zgvsl2e7j4BYctxCh2XD2oVN1i3',
    socket: {
        host: 'redis-11160.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11160
    }
});

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  (async () => {
    try {
        await client.connect(); // Ensure the client connects
    } catch (error) {
        console.error('Redis connection error:', error);
    }
})();

module.exports = client;
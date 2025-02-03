const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'toG3PP1OZs8K5O3QbluOimVpiZMcjR11',
    socket: {
        host: 'redis-14534.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14534
    }
});

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.error('Redis error:', err.message);
  });

  (async () => {
    try {
        await client.connect(); // Ensure the client connects
    } catch (error) {
        console.error('Redis connection error:', error);
    }
})();

module.exports = client;
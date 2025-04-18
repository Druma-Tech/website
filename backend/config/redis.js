const { createClient } = require('redis');

const client = createClient({
    url: "rediss://default:Ad-AAAIjcDFkYTdkZWY5ZTdjZGE0ZjdmOWY0YjExYmQxMGNmYjhlOHAxMA@intent-squid-57216.upstash.io:6379"
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
        console.log(await client.ping()); // Test connection
    } catch (error) {
        console.error('Redis connection error:', error);
    }
})();

module.exports = client;

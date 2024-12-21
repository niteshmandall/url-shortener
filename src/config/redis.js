const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1);
  }
}

module.exports = {
  connectRedis,
  redisClient,
};
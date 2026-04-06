require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

async function closeRedis() {
  if (client.isOpen) {
    await client.quit();
  }
}

module.exports = { connectRedis, closeRedis };
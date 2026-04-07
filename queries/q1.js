const { getTweetCollection, closeMongo } = require('../config/mongo');
const { connectRedis, closeRedis } = require('../config/redis');

async function main() {
  const collection = await getTweetCollection();
  const redis = await connectRedis();

  await redis.set('tweetCount', 0);

  const cursor = collection.find({}, { projection: { _id: 1 } });

  for await (const _tweet of cursor) {
    await redis.incr('tweetCount');
  }

  const totalTweets = await redis.get('tweetCount');
  console.log(`There were ${totalTweets} tweets`);
}

main()
  .catch((err) => {
    console.error('Query1 error:', err);
  })
  .finally(async () => {
    await closeMongo();
    await closeRedis();
  });
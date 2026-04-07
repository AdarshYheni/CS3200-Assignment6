const { getTweetCollection, closeMongo } = require('../config/mongo');
const { connectRedis, closeRedis } = require('../config/redis');

async function main() {
  const collection = await getTweetCollection();
  const redis = await connectRedis();

  await redis.del('screen_names');

  const cursor = collection.find(
    {},
    { projection: { 'user.screen_name': 1 } }
  );

  for await (const tweet of cursor) {
    const screenName = tweet.user?.screen_name;
    if (screenName) {
      await redis.sAdd('screen_names', screenName);
    }
  }

  const distinctUsers = await redis.sCard('screen_names');
  console.log(`There were ${distinctUsers} distinct users`);
}

main()
  .catch((err) => {
    console.error('Query3 error:', err);
  })
  .finally(async () => {
    await closeMongo();
    await closeRedis();
  });
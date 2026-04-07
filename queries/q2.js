const { getTweetCollection, closeMongo } = require('../config/mongo');
const { connectRedis, closeRedis } = require('../config/redis');

async function main() {
  const collection = await getTweetCollection();
  const redis = await connectRedis();

  await redis.set('favoritesSum', 0);

  const cursor = collection.find(
    {},
    { projection: { favorite_count: 1 } }
  );

  for await (const tweet of cursor) {
    const favorites = Number(tweet.favorite_count) || 0;
    await redis.incrBy('favoritesSum', favorites);
  }

  const totalFavorites = await redis.get('favoritesSum');
  console.log(`There were ${totalFavorites} favorites in total`);
}

main()
  .catch((err) => {
    console.error('Query2 error:', err);
  })
  .finally(async () => {
    await closeMongo();
    await closeRedis();
  });
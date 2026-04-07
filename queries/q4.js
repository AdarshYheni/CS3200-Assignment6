const { getTweetCollection, closeMongo } = require('../config/mongo');
const { connectRedis, closeRedis } = require('../config/redis');

async function main() {
  const collection = await getTweetCollection();
  const redis = await connectRedis();

  await redis.del('leaderboard');

  const cursor = collection.find(
    {},
    { projection: { 'user.screen_name': 1 } }
  );

  for await (const tweet of cursor) {
    const screenName = tweet.user?.screen_name;
    if (screenName) {
      await redis.zIncrBy('leaderboard', 1, screenName);
    }
  }

  const topUsers = await redis.zRange('leaderboard', -10, -1, {
    REV: true,
    WITHSCORES: true
  });

  console.log('Top 10 users with the most tweets:');
  for (let index = 0; index < topUsers.length; index += 2) {
    const user = topUsers[index];
    const score = topUsers[index + 1];
    console.log(`${index / 2 + 1}. ${user} - ${score} tweets`);
  }
}

main()
  .catch((err) => {
    console.error('Query4 error:', err);
  })
  .finally(async () => {
    await closeMongo();
    await closeRedis();
  });
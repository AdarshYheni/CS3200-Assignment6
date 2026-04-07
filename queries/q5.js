const { getTweetCollection, closeMongo } = require('../config/mongo');
const { connectRedis, closeRedis } = require('../config/redis');

async function main() {
  const collection = await getTweetCollection();
  const redis = await connectRedis();

  const cursor = collection.find(
    {},
    {
      projection: {
        id_str: 1,
        created_at: 1,
        text: 1,
        favorite_count: 1,
        retweet_count: 1,
        lang: 1,
        source: 1,
        'user.screen_name': 1,
        'user.name': 1,
        'user.id_str': 1
      }
    }
  );

  let processed = 0;

  for await (const tweet of cursor) {
    const tweetId = tweet.id_str;
    const screenName = tweet.user?.screen_name;

    if (!tweetId || !screenName) {
      continue;
    }

    const listKey = `tweets:${screenName}`;
    const hashKey = `tweet:${tweetId}`;

    await redis.rPush(listKey, tweetId);

    await redis.hSet(hashKey, {
      tweet_id: tweetId,
      created_at: tweet.created_at || '',
      text: tweet.text || '',
      favorite_count: String(tweet.favorite_count || 0),
      retweet_count: String(tweet.retweet_count || 0),
      lang: tweet.lang || '',
      source: tweet.source || '',
      user_screen_name: screenName,
      user_name: tweet.user?.name || '',
      user_id_str: tweet.user?.id_str || ''
    });

    processed += 1;
  }

  console.log(`Created user tweet lists and tweet hashes for ${processed} tweets`);
  console.log('Example lookup pattern:');
  console.log('1. Get all tweet IDs from tweets:sgeoviz');
  console.log('2. Then inspect each tweet:<tweet_id> hash');
}

main()
  .catch((err) => {
    console.error('Query5 error:', err);
  })
  .finally(async () => {
    await closeMongo();
    await closeRedis();
  });
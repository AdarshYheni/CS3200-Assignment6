require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function main() {
  await client.connect();

  const db = client.db(process.env.MONGO_DB_NAME);
  const collection = db.collection(process.env.MONGO_COLLECTION_NAME);

  const tweet = await collection.findOne({});
  console.log(tweet);

  await client.close();
}

main().catch(console.error);
require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);
let mongoConnected = false;

async function getTweetCollection() {
  if (!mongoConnected) {
    await client.connect();
    mongoConnected = true;
  }

  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection(process.env.MONGO_COLLECTION_NAME);
}

async function closeMongo() {
  if (mongoConnected) {
    await client.close();
    mongoConnected = false;
  }
}

module.exports = { getTweetCollection, closeMongo };
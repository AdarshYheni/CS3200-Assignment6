require('dotenv').config();

console.log("DB:", process.env.MONGO_DB_NAME);
console.log("Collection:", process.env.MONGO_COLLECTION_NAME);
# CS3200 Assignment 6 – Redis + MongoDB

## Overview

This assignment uses Node.js to interact with both MongoDB and an in-memory Redis database. The MongoDB dataset contains tweets from the IEEE VIS 2020 conference. Redis is used to build derived data structures and perform computations efficiently.

The goal is to demonstrate the use of different Redis data structures including:
- Strings
- Sets
- Sorted Sets
- Lists
- Hashes

---

## Dataset

- **The dataset was imported into MongoDB using:**
`mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ieeevis2020Tweets.dump`
- **Database:** `ieeevisTweets`
- **Collection:** `tweet`

---

## Project Structure
    ├── config/
    │   ├── mongo.js
    │   └── redis.js
    ├── queries/
    │   ├── query1.js
    │   ├── query2.js
    │   ├── query3.js
    │   ├── query4.js
    │   └── query5.js
    ├── package.json
    ├── package-lock.json
    └── README.md

---

## Setup Instructions

### 1. Install dependencies
npm install

---

### 2. Configure environment variables

    Create a `.env` file in the root directory:
    MONGO_URI=mongodb://127.0.0.1:27017
    MONGO_DB_NAME=ieeevisTweets
    MONGO_COLLECTION_NAME=tweet
    REDIS_URL=redis://127.0.0.1:6379


---

### 3. Start Redis (Docker)
    docker run -d --name redis-hw -p 6379:6379 redis:latest


---

### 4. Run queries
    npm run q1
    npm run q2
    npm run q3
    npm run q4
    npm run q5

---

## Queries

| Query | Description |
|------|------------|
| Query 1 | Computes the total number of tweets. Initializes a Redis string key `tweetCount` to 0 and increments it (`INCR`) for each tweet retrieved from MongoDB. |
| Query 2 | Computes the total number of favorites across all tweets. Uses a Redis string key `favoritesSum` and increments it (`INCRBY`) using each tweet’s `favorite_count`. |
| Query 3 | Computes the number of distinct users. Uses a Redis set `screen_names` and inserts each `user.screen_name` using `SADD`, then retrieves the unique count using `SCARD`. |
| Query 4 | Creates a leaderboard of the top 10 users with the most tweets. Uses a Redis sorted set `leaderboard`, incrementing scores with `ZINCRBY` and retrieving the top users in descending order. |
| Query 5 | Builds a structure to retrieve all tweets for a specific user. Uses a Redis list `tweets:<screen_name>` to store tweet IDs and a Redis hash `tweet:<tweet_id>` to store detailed tweet information. |


---

## Redis Data Structures Used

| Query | Data Structure |
|------|---------------|
| Q1   | String        |
| Q2   | String        |
| Q3   | Set           |
| Q4   | Sorted Set    |
| Q5   | List + Hash   |

---

## Notes

- MongoDB is used as the source of truth.
- Redis is used to build derived data and fast lookup structures.
- Keys are reset (where necessary) to avoid duplicate counts when re-running queries.
- Missing or null fields are handled safely during processing.

---
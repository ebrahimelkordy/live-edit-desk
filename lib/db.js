import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to the environment variables as MONGODB_URI');
}

let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  if (cachedDb) {
    console.log('[DB] Using cached database connection');
    return cachedDb;
  }

  console.log('[DB] Creating new database connection...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('[DB] Database connected successfully');

  const db = client.db();
  cachedClient = client;
  cachedDb = db;
  console.log('[DB] Database reference cached');

  return db;
}
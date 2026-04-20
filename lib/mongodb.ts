import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

export default async function getMongoClient() {
  if (globalForMongo._mongoClient) {
    return globalForMongo._mongoClient;
  }

  if (!globalForMongo._mongoClientPromise) {
    console.log("Mongo URI present:", Boolean(uri));
    console.log("Mongo URI preview:", uri.replace(/\/\/.*:.*@/, "//***:***@"));

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    globalForMongo._mongoClientPromise = client.connect();
  }

  try {
    const client = await globalForMongo._mongoClientPromise;
    console.log("Mongo connected successfully");
    globalForMongo._mongoClient = client;
    return client;
  } catch (error) {
    console.error("Mongo connect failed:", error);
    globalForMongo._mongoClientPromise = undefined;
    throw error;
  }
}
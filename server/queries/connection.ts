import { MongoClient, ObjectId, type Db } from "mongodb";
import { env } from "../lib/env";

let client: MongoClient | null = null;
let dbInstance: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(env.databaseUrl);
    await client.connect();
  }
  return client;
}

export async function getDb(): Promise<Db> {
  if (!dbInstance) {
    const mongoClient = await getMongoClient();
    dbInstance = mongoClient.db("healthcare_app");
  }
  return dbInstance;
}

export { ObjectId };

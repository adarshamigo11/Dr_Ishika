import { ObjectId, getDb } from "./connection";
import type { InsertUser, User } from "@db/schema";

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  return db.collection<User>("users").findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDb();
  return db.collection<User>("users").findOne({ _id: new ObjectId(id) });
}

export async function createUser(data: InsertUser): Promise<{ insertedId: string }> {
  const db = await getDb();
  const doc: User = {
    ...data,
    email: data.email?.toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignInAt: new Date(),
  };
  const result = await db.collection<User>("users").insertOne(doc);
  return { insertedId: result.insertedId.toString() };
}

export async function updateUserLastSignIn(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<User>("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { lastSignInAt: new Date(), updatedAt: new Date() } }
  );
}
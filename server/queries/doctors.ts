import { ObjectId, getDb } from "./connection.js";
import type { InsertDoctor, Doctor } from "@db/schema";

export async function findAllDoctors(search?: string): Promise<Doctor[]> {
  const db = await getDb();
  const filter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};
  return db
    .collection<Doctor>("doctors")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findDoctorById(id: string): Promise<Doctor | null> {
  const db = await getDb();
  return db.collection<Doctor>("doctors").findOne({ _id: new ObjectId(id) });
}

export async function findDoctorByUserId(userId: string): Promise<Doctor | null> {
  const db = await getDb();
  return db.collection<Doctor>("doctors").findOne({ userId });
}

export async function createDoctor(data: InsertDoctor): Promise<{ insertedId: string }> {
  const db = await getDb();
  const doc: Doctor = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection<Doctor>("doctors").insertOne(doc);
  return { insertedId: result.insertedId.toString() };
}

export async function updateDoctor(id: string, data: Partial<InsertDoctor>): Promise<void> {
  const db = await getDb();
  await db.collection<Doctor>("doctors").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteDoctor(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<Doctor>("doctors").deleteOne({ _id: new ObjectId(id) });
}

export async function countDoctors(): Promise<number> {
  const db = await getDb();
  return db.collection<Doctor>("doctors").countDocuments();
}

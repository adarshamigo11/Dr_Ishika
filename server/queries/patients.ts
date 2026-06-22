import { ObjectId, getDb } from "./connection.js";
import type { InsertPatient, Patient } from "@db/schema";

export async function findAllPatients(search?: string): Promise<Patient[]> {
  const db = await getDb();
  const filter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};
  return db
    .collection<Patient>("patients")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findPatientById(id: string): Promise<Patient | null> {
  const db = await getDb();
  return db.collection<Patient>("patients").findOne({ _id: new ObjectId(id) });
}

export async function findPatientByUserId(userId: string): Promise<Patient | null> {
  const db = await getDb();
  return db.collection<Patient>("patients").findOne({ userId });
}

export async function createPatient(data: InsertPatient): Promise<{ insertedId: string }> {
  const db = await getDb();
  const doc: Patient = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection<Patient>("patients").insertOne(doc);
  return { insertedId: result.insertedId.toString() };
}

export async function updatePatient(id: string, data: Partial<InsertPatient>): Promise<void> {
  const db = await getDb();
  await db.collection<Patient>("patients").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deletePatient(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<Patient>("patients").deleteOne({ _id: new ObjectId(id) });
}

export async function countPatients(): Promise<number> {
  const db = await getDb();
  return db.collection<Patient>("patients").countDocuments();
}

import { ObjectId, getDb } from "./connection.js";
import type { InsertMedicalRecord, MedicalRecord } from "@db/schema";

export async function findAllRecords(): Promise<MedicalRecord[]> {
  const db = await getDb();
  return db
    .collection<MedicalRecord>("medical_records")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findRecordsByPatientId(patientId: string): Promise<MedicalRecord[]> {
  const db = await getDb();
  return db
    .collection<MedicalRecord>("medical_records")
    .find({ patientId })
    .sort({ recordDate: -1 })
    .toArray();
}

export async function findRecordsByDoctorId(doctorId: string): Promise<MedicalRecord[]> {
  const db = await getDb();
  return db
    .collection<MedicalRecord>("medical_records")
    .find({ doctorId })
    .sort({ recordDate: -1 })
    .toArray();
}

export async function findRecordById(id: string): Promise<MedicalRecord | null> {
  const db = await getDb();
  return db.collection<MedicalRecord>("medical_records").findOne({ _id: new ObjectId(id) });
}

export async function createRecord(data: InsertMedicalRecord): Promise<{ insertedId: string }> {
  const db = await getDb();
  const doc: MedicalRecord = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection<MedicalRecord>("medical_records").insertOne(doc);
  return { insertedId: result.insertedId.toString() };
}

export async function updateRecord(id: string, data: Partial<InsertMedicalRecord>): Promise<void> {
  const db = await getDb();
  await db.collection<MedicalRecord>("medical_records").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<MedicalRecord>("medical_records").deleteOne({ _id: new ObjectId(id) });
}

export async function countRecords(): Promise<number> {
  const db = await getDb();
  return db.collection<MedicalRecord>("medical_records").countDocuments();
}

export async function countRecordsByStatus(): Promise<{ status: string; count: number }[]> {
  const db = await getDb();
  const result = await db
    .collection<MedicalRecord>("medical_records")
    .aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ])
    .toArray();
  return result as { status: string; count: number }[];
}

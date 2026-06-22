import { ObjectId, getDb } from "./connection.js";
import type { InsertAppointment, Appointment } from "@db/schema";

export async function findAllAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  return db
    .collection<Appointment>("appointments")
    .find()
    .sort({ appointmentDate: -1 })
    .toArray();
}

export async function findAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  const db = await getDb();
  return db
    .collection<Appointment>("appointments")
    .find({ patientId })
    .sort({ appointmentDate: -1 })
    .toArray();
}

export async function findAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
  const db = await getDb();
  return db
    .collection<Appointment>("appointments")
    .find({ doctorId })
    .sort({ appointmentDate: -1 })
    .toArray();
}

export async function findAppointmentById(id: string): Promise<Appointment | null> {
  const db = await getDb();
  return db.collection<Appointment>("appointments").findOne({ _id: new ObjectId(id) });
}

export async function createAppointment(data: InsertAppointment): Promise<{ insertedId: string }> {
  const db = await getDb();
  const doc: Appointment = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection<Appointment>("appointments").insertOne(doc);
  return { insertedId: result.insertedId.toString() };
}

export async function updateAppointment(id: string, data: Partial<InsertAppointment>): Promise<void> {
  const db = await getDb();
  await db.collection<Appointment>("appointments").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteAppointment(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<Appointment>("appointments").deleteOne({ _id: new ObjectId(id) });
}

export async function countAppointments(): Promise<number> {
  const db = await getDb();
  return db.collection<Appointment>("appointments").countDocuments();
}

export async function countAppointmentsByStatus(): Promise<{ status: string; count: number }[]> {
  const db = await getDb();
  const result = await db
    .collection<Appointment>("appointments")
    .aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ])
    .toArray();
  return result as { status: string; count: number }[];
}

export async function findUpcomingAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];
  return db
    .collection<Appointment>("appointments")
    .find({
      appointmentDate: { $gte: today },
      status: "scheduled",
    })
    .sort({ appointmentDate: 1 })
    .limit(10)
    .toArray();
}

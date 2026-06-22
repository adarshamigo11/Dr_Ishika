import { getDb, getMongoClient } from "../api/queries/connection";
import type { Doctor, Patient } from "./schema";

async function seed() {
  const db = await getDb();
  console.log("Seeding database...");

  // Seed doctors
  const doctorsCollection = db.collection<Doctor>("doctors");
  const doctorsCount = await doctorsCollection.countDocuments();
  if (doctorsCount === 0) {
    await doctorsCollection.insertMany([
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
        specialization: "Cardiology",
        qualification: "MD, FACC",
        experience: 15,
        phone: "+1-555-0101",
        isActive: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Michael Chen",
        email: "michael.chen@hospital.com",
        specialization: "Neurology",
        qualification: "MD, PhD",
        experience: 12,
        phone: "+1-555-0102",
        isActive: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Seeded doctors.");
  }

  // Seed patients
  const patientsCollection = db.collection<Patient>("patients");
  const patientsCount = await patientsCollection.countDocuments();
  if (patientsCount === 0) {
    await patientsCollection.insertMany([
      {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1-555-0201",
        dateOfBirth: "1985-03-15",
        gender: "male",
        address: "123 Main St, New York, NY",
        bloodGroup: "O+",
        isActive: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1-555-0202",
        dateOfBirth: "1990-07-22",
        gender: "female",
        address: "456 Oak Ave, Los Angeles, CA",
        bloodGroup: "A-",
        isActive: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Seeded patients.");
  }

  console.log("Done.");
  const client = await getMongoClient();
  await client.close();
  process.exit(0);
}

seed();

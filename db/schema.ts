import { ObjectId } from "mongodb";

// ─── Users ───
export interface User {
  _id?: ObjectId;
  unionId?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: "user" | "admin" | "doctor" | "patient";
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt: Date;
}

export type InsertUser = Omit<User, "_id" | "createdAt" | "updatedAt" | "lastSignInAt"> & Partial<Pick<User, "createdAt" | "updatedAt" | "lastSignInAt" >>;

// ─── Doctors ───
export interface Doctor {
  _id?: ObjectId;
  userId?: string;
  name: string;
  email: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  phone?: string;
  avatar?: string;
  bio?: string;
  isActive: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export type InsertDoctor = Omit<Doctor, "_id" | "createdAt" | "updatedAt"> & Partial<Pick<Doctor, "createdAt" | "updatedAt" >>;

// ─── Patients ───
export interface Patient {
  _id?: ObjectId;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  isActive: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export type InsertPatient = Omit<Patient, "_id" | "createdAt" | "updatedAt"> & Partial<Pick<Patient, "createdAt" | "updatedAt" >>;

// ─── Medical Records ───
export interface MedicalRecord {
  _id?: ObjectId;
  patientId: string;
  doctorId?: string;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  status: "active" | "resolved" | "ongoing";
  recordDate: string;
  followUpDate?: string;
  attachments?: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

export type InsertMedicalRecord = Omit<MedicalRecord, "_id" | "createdAt" | "updatedAt"> & Partial<Pick<MedicalRecord, "createdAt" | "updatedAt" >>;

// ─── Appointments ───
export interface Appointment {
  _id?: ObjectId;
  patientId: string;
  doctorId?: string;
  appointmentDate: string;
  appointmentTime?: string;
  type: "consultation" | "followup" | "therapy" | "assessment";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertAppointment = Omit<Appointment, "_id" | "createdAt" | "updatedAt"> & Partial<Pick<Appointment, "createdAt" | "updatedAt" >>;

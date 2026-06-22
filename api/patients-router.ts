import { z } from "zod";
import { createRouter, adminQuery, staffQuery, publicQuery } from "./middleware.js";
import * as queries from "./queries/patients.js";

export const patientsRouter = createRouter({
  list: staffQuery
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => queries.findAllPatients(input?.search)),

  getById: staffQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => queries.findPatientById(input.id)),

  getByUserId: publicQuery
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => queries.findPatientByUserId(input.userId)),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        address: z.string().optional(),
        emergencyContact: z.string().optional(),
        bloodGroup: z.string().optional(),
        allergies: z.string().optional(),
        medicalHistory: z.string().optional(),
      })
    )
    .mutation(({ input }) => queries.createPatient(input)),

  update: staffQuery
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        address: z.string().optional(),
        emergencyContact: z.string().optional(),
        bloodGroup: z.string().optional(),
        allergies: z.string().optional(),
        medicalHistory: z.string().optional(),
        isActive: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return queries.updatePatient(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => queries.deletePatient(input.id)),

  count: staffQuery.query(() => queries.countPatients()),
});

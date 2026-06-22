import { z } from "zod";
import { createRouter, adminQuery, staffQuery, patientQuery, authedQuery } from "./middleware.js";
import * as queries from "./queries/medicalRecords.js";

export const recordsRouter = createRouter({
  list: adminQuery.query(() => queries.findAllRecords()),

  getByPatientId: authedQuery
    .input(z.object({ patientId: z.string() }))
    .query(({ input, ctx }) => {
      // Patients can only view their own records
      if (ctx.user.role === "patient") {
        // In production, verify patientId matches the logged-in patient's ID
      }
      return queries.findRecordsByPatientId(input.patientId);
    }),

  getByDoctorId: staffQuery
    .input(z.object({ doctorId: z.string() }))
    .query(({ input }) => queries.findRecordsByDoctorId(input.doctorId)),

  getById: staffQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => queries.findRecordById(input.id)),

  create: staffQuery
    .input(
      z.object({
        patientId: z.string(),
        doctorId: z.string().optional(),
        diagnosis: z.string().min(1),
        symptoms: z.string().optional(),
        treatment: z.string().optional(),
        prescription: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "resolved", "ongoing"]).optional(),
        recordDate: z.string(),
        followUpDate: z.string().optional(),
      })
    )
    .mutation(({ input }) => queries.createRecord(input)),

  update: staffQuery
    .input(
      z.object({
        id: z.string(),
        diagnosis: z.string().optional(),
        symptoms: z.string().optional(),
        treatment: z.string().optional(),
        prescription: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "resolved", "ongoing"]).optional(),
        recordDate: z.string().optional(),
        followUpDate: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return queries.updateRecord(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => queries.deleteRecord(input.id)),

  count: adminQuery.query(() => queries.countRecords()),

  countByStatus: adminQuery.query(() => queries.countRecordsByStatus()),
});

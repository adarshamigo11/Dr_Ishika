import { z } from "zod";
import { createRouter, adminQuery, staffQuery, authedQuery } from "./middleware.js";
import * as queries from "./queries/appointments.js";

export const appointmentsRouter = createRouter({
  list: adminQuery.query(() => queries.findAllAppointments()),

  getByPatientId: authedQuery
    .input(z.object({ patientId: z.string() }))
    .query(({ input }) => queries.findAppointmentsByPatientId(input.patientId)),

  getByDoctorId: staffQuery
    .input(z.object({ doctorId: z.string() }))
    .query(({ input }) => queries.findAppointmentsByDoctorId(input.doctorId)),

  getById: staffQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => queries.findAppointmentById(input.id)),

  create: staffQuery
    .input(
      z.object({
        patientId: z.string(),
        doctorId: z.string().optional(),
        appointmentDate: z.string(),
        appointmentTime: z.string().optional(),
        type: z.enum(["consultation", "followup", "therapy", "assessment"]).optional(),
        status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(({ input }) => queries.createAppointment(input)),

  update: staffQuery
    .input(
      z.object({
        id: z.string(),
        patientId: z.string().optional(),
        doctorId: z.string().optional(),
        appointmentDate: z.string().optional(),
        appointmentTime: z.string().optional(),
        type: z.enum(["consultation", "followup", "therapy", "assessment"]).optional(),
        status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return queries.updateAppointment(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => queries.deleteAppointment(input.id)),

  count: adminQuery.query(() => queries.countAppointments()),

  countByStatus: adminQuery.query(() => queries.countAppointmentsByStatus()),

  upcoming: staffQuery.query(() => queries.findUpcomingAppointments()),
});

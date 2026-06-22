import { z } from "zod";
import { createRouter, adminQuery, publicQuery } from "./middleware.js";
import * as queries from "./queries/doctors.js";

export const doctorsRouter = createRouter({
  list: publicQuery
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => queries.findAllDoctors(input?.search)),

  getById: publicQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => queries.findDoctorById(input.id)),

  getByUserId: publicQuery
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => queries.findDoctorByUserId(input.userId)),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        specialization: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().optional(),
        phone: z.string().optional(),
        avatar: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(({ input }) => queries.createDoctor(input)),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        specialization: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().optional(),
        phone: z.string().optional(),
        avatar: z.string().optional(),
        bio: z.string().optional(),
        isActive: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return queries.updateDoctor(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => queries.deleteDoctor(input.id)),

  count: publicQuery.query(() => queries.countDoctors()),
});

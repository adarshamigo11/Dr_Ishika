import { authRouter } from "./auth-router";
import { doctorsRouter } from "./doctors-router";
import { patientsRouter } from "./patients-router";
import { recordsRouter } from "./records-router";
import { appointmentsRouter } from "./appointments-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  doctors: doctorsRouter,
  patients: patientsRouter,
  records: recordsRouter,
  appointments: appointmentsRouter,
});

export type AppRouter = typeof appRouter;

import { authRouter } from "./auth-router.js";
import { doctorsRouter } from "./doctors-router.js";
import { patientsRouter } from "./patients-router.js";
import { recordsRouter } from "./records-router.js";
import { appointmentsRouter } from "./appointments-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  doctors: doctorsRouter,
  patients: patientsRouter,
  records: recordsRouter,
  appointments: appointmentsRouter,
});

export type AppRouter = typeof appRouter;

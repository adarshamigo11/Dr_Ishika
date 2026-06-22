import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { signSessionToken } from "./lib/session";
import { findUserByEmail, createUser, updateUserLastSignIn } from "./queries/users";
import { env } from "./lib/env";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { TRPCError } from "@trpc/server";

// Simple password hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + env.appSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["user", "admin", "doctor", "patient"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists with this email",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const role = input.email.toLowerCase() === env.ownerEmail.toLowerCase()
        ? "admin"
        : (input.role ?? "user");

      const result = await createUser({
        unionId: input.email.toLowerCase(),
        name: input.name,
        email: input.email.toLowerCase(),
        role: role,
        avatar: undefined,
      });

      // Store password hash in a separate collection
      const db = await (await import("./queries/connection")).getDb();
      await db.collection("passwords").insertOne({
        userId: result.insertedId,
        passwordHash,
        createdAt: new Date(),
      });

      const token = await signSessionToken({
        userId: result.insertedId,
        email: input.email.toLowerCase(),
        role: role,
      });

      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return { success: true, userId: result.insertedId };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const db = await (await import("./queries/connection")).getDb();
      const passwordRecord = await db.collection("passwords").findOne({
        userId: user._id?.toString(),
      });

      if (!passwordRecord) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await verifyPassword(input.password, passwordRecord.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      await updateUserLastSignIn(user._id!.toString());

      const token = await signSessionToken({
        userId: user._id!.toString(),
        email: user.email!,
        role: user.role,
      });

      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return { success: true, user: { id: user._id?.toString(), name: user.name, email: user.email, role: user.role } };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});

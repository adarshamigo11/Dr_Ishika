import * as jose from "jose";
import { env } from "../lib/env";

const JWT_ALG = "HS256";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    const { userId, email, role } = payload;
    if (!userId || !email) {
      return null;
    }
    return { userId: userId as string, email: email as string, role: role as string };
  } catch (error) {
    return null;
  }
}
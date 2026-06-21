import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "ydr_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!password) {
    throw new Error("ADMIN_PASSWORD is missing from the environment.");
  }

  return password;
}

function signValue(value: string) {
  return createHmac("sha256", getAdminPassword()).update(value).digest("hex");
}

function createSessionValue(expiresAt: number) {
  const payload = String(expiresAt);
  return `${payload}.${signValue(payload)}`;
}

function isValidSessionValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  const [expiresAtPart, signature] = value.split(".");
  const expiresAt = Number(expiresAtPart);

  if (
    !expiresAtPart ||
    !signature ||
    Number.isNaN(expiresAt) ||
    !/^[0-9a-f]+$/i.test(signature)
  ) {
    return false;
  }

  if (Date.now() > expiresAt) {
    return false;
  }

  const expectedSignature = signValue(expiresAtPart);

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(signature, "hex")
  );
}

export function isAdminPassword(password: string) {
  const expected = Buffer.from(getAdminPassword(), "utf8");
  const provided = Buffer.from(password, "utf8");

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return isValidSessionValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000;

  cookieStore.set(ADMIN_COOKIE_NAME, createSessionValue(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

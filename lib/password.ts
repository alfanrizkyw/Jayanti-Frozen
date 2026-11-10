import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const PREFIX = "scrypt";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${PREFIX}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.startsWith(`${PREFIX}$`)) return false;
  const [, salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  const harap = Buffer.from(hash, "hex");
  const coba = scryptSync(password, salt, 64);
  return harap.length === coba.length && timingSafeEqual(harap, coba);
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Perbandingan waktu-tetap untuk password dari environment. */
export function sameSecret(input: string, expected: string): boolean {
  if (!input || !expected) return false;
  return timingSafeEqual(digest(input), digest(expected));
}

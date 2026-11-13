import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";

const COOKIE = "jf_session";
// Kunci acak per proses membuat semua cookie staff tidak valid setiap kali
// instans server baru dibuat. Turunkan kunci stabil dari env server yang
// selalu ada (kredensial Sheets), dengan AUTH_SECRET sebagai pilihan utama.
function turunanStabil() {
  const bahan = [
    process.env.GOOGLE_SPREADSHEET_ID,
    process.env.GOOGLE_SHEETS_KEY,
    process.env.GOOGLE_SHEETS_URL,
    process.env.BLOB_READ_WRITE_TOKEN,
    process.env.FONNTE_TOKEN,
    process.env.WHATSAPP_TOKEN,
    process.env.DEVELOPER_PASSWORD,
  ]
    .filter(Boolean)
    .join("|");
  if (bahan) {
    return createHmac("sha256", bahan).update("jf-session-key").digest("hex");
  }
  return process.env.NODE_ENV === "production"
    ? randomBytes(32).toString("hex")
    : "jayanti-frozen-dev-secret";
}
const SECRET = process.env.AUTH_SECRET?.trim() || turunanStabil();
const MAX_AGE = 60 * 60 * 24;

/** Kunci stabil untuk menandatangani tautan tugas kurir. */
export function kunciServer(): string {
  return SECRET;
}

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function encode(user: SessionUser) {
  const body = Buffer.from(
    JSON.stringify({ ...user, exp: Date.now() + MAX_AGE * 1000 }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export async function setSession(user: SessionUser) {
  const store = await cookies();
  store.set(COOKIE, encode(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [body, signature] = raw.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!data?.role || !data?.nama) return null;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { role: data.role, nama: data.nama, telepon: data.telepon, id: data.id };
  } catch {
    return null;
  }
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

export function courierPassword(): string {
  return process.env.COURIER_PASSWORD?.trim() || "";
}

export function developerPassword(): string {
  return process.env.DEVELOPER_PASSWORD?.trim() || "";
}

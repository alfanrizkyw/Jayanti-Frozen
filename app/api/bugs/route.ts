import { NextResponse } from "next/server";
import { catatBug } from "@/lib/data";

const BATAS = 20;
const JEDA = 10 * 60_000;
const catatan = new Map<string, { jumlah: number; sampai: number }>();

function bolehKirim(ip: string) {
  const sekarang = Date.now();
  const data = catatan.get(ip);
  if (!data || data.sampai < sekarang) {
    catatan.set(ip, { jumlah: 1, sampai: sekarang + JEDA });
    return true;
  }
  if (data.jumlah >= BATAS) return false;
  data.jumlah += 1;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "lokal";
  if (!bolehKirim(ip))
    return NextResponse.json({ ok: false }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await catatBug({
      pesan: String(body.pesan ?? ""),
      halaman: String(body.halaman ?? ""),
      peran: String(body.peran ?? ""),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

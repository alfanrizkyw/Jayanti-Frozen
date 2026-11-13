import { NextResponse } from "next/server";
import { getActiveOrderCodes } from "@/lib/data";

export const dynamic = "force-dynamic";

// Pembatasan sederhana: pencarian nomor HP tidak boleh dipakai untuk menebak
// nomor orang lain secara beruntun.
const JENDELA = 10 * 60 * 1000;
const BATAS = 15;
const catatan = new Map<string, number[]>();

function boleh(ip: string): boolean {
  const sekarang = Date.now();
  const lama = (catatan.get(ip) ?? []).filter((t) => sekarang - t < JENDELA);
  if (lama.length >= BATAS) {
    catatan.set(ip, lama);
    return false;
  }
  lama.push(sekarang);
  catatan.set(ip, lama);
  if (catatan.size > 5000) catatan.clear();
  return true;
}

export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "lokal";
  if (!boleh(ip))
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Tunggu beberapa menit." },
      { status: 429 },
    );

  const hp = new URL(req.url).searchParams.get("hp") ?? "";
  const kode = await getActiveOrderCodes(hp);
  return NextResponse.json(
    { kode },
    { headers: { "Cache-Control": "no-store" } },
  );
}

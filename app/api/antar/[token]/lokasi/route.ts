import { NextResponse } from "next/server";
import { bad } from "@/lib/api";
import { simpanLokasiTugas } from "@/lib/tugas-kurir";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await req.json().catch(() => ({}));
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  try {
    await simpanLokasiTugas(decodeURIComponent(token), lat, lng);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Lokasi gagal dikirim.");
  }
}

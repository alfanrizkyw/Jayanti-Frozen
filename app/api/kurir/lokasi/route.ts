import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { courierLocation } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("kurir");
  if (response) return response;

  const body = await req.json().catch(() => ({}));
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  const kode = typeof body.kode === "string" ? body.kode : undefined;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
    return bad("Koordinat tidak valid.");

  await courierLocation(lat, lng, kode);
  return NextResponse.json({ ok: true });
}

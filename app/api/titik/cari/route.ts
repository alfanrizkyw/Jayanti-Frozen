import { NextResponse } from "next/server";
import { cariTitikAlamat } from "@/lib/peta";

// Pencarian alamat bisa butuh waktu pada permintaan pertama.
export const maxDuration = 20;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const alamat = typeof body?.alamat === "string" ? body.alamat.trim() : "";
  if (alamat.length < 8)
    return NextResponse.json(
      { error: "Tulis alamat lengkap dulu, lalu cocokkan." },
      { status: 400 },
    );

  const hasil = await cariTitikAlamat(alamat);
  if (!hasil)
    return NextResponse.json(
      {
        error:
          "Alamat belum ditemukan di peta. Geser pin langsung ke lokasi rumah.",
      },
      { status: 404 },
    );

  return NextResponse.json(
    { titik: hasil.titik, presisi: hasil.presisi },
    { headers: { "Cache-Control": "no-store" } },
  );
}

import { NextResponse } from "next/server";
import { getOrderDetail } from "@/lib/data";
import { rutePengantaran } from "@/lib/peta";

// Pencarian alamat + rute jalan bisa butuh waktu pada permintaan pertama.
export const maxDuration = 30;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  const detail = await getOrderDetail(decodeURIComponent(kode), true);
  if (!detail)
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  if (detail.order.metode !== "antar")
    return NextResponse.json({ fallback: true });

  const rute = await rutePengantaran(detail.order, detail.settings);
  if (!rute) return NextResponse.json({ fallback: true });

  return NextResponse.json(
    { ...rute, kode: detail.order.kode, alamat: detail.order.alamat },
    { headers: { "Cache-Control": "no-store" } },
  );
}

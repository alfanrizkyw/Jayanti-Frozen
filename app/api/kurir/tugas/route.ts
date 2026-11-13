import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { courierFinish, getCourierData } from "@/lib/data";

export async function GET() {
  const { response } = await guard("kurir");
  if (response) return response;

  const data = await getCourierData(true);
  return NextResponse.json(
    {
      orders: data.orders,
      riwayat: data.riwayat,
      items: data.items,
      deliveries: data.deliveries,
      settings: data.settings,
      serverTime: Date.now(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  const { response } = await guard("kurir");
  if (response) return response;

  const body = await req.json().catch(() => ({}));
  const aksi = String(body.aksi ?? "");
  const kode = String(body.kode ?? "");

  try {
    // Admin sudah menyerahkan tugas; kurir cukup menyelesaikan dengan foto.
    if (aksi !== "selesai") return bad("Aksi tidak dikenal.");
    await courierFinish(kode);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal memperbarui tugas.");
  }
}

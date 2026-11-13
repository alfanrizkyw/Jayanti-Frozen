import { NextResponse } from "next/server";
import { getOrderDetail } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  const detail = await getOrderDetail(decodeURIComponent(kode), true);
  if (!detail)
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });

  const { order, items, delivery, kurir, settings } = detail;
  return NextResponse.json({
    order,
    items,
    delivery,
    kurir: kurir
      ? {
          id: kurir.id,
          nama: kurir.nama,
          kendaraan: kurir.kendaraan,
          rating: kurir.rating,
          telepon: kurir.telepon,
        }
      : null,
    estimasiMenit: settings.estimasiAntar,
    teleponToko: settings.telepon,
    namaToko: settings.namaToko,
    serverTime: Date.now(),
  });
}

import { NextResponse } from "next/server";
import { getOrderDetail, updateOrderTitik } from "@/lib/data";

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Data titik tidak valid." }, { status: 400 });

  try {
    const order = await updateOrderTitik(
      decodeURIComponent(kode),
      Number(body.lat),
      Number(body.lng),
    );
    return NextResponse.json(
      { ok: true, order },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Titik gagal disimpan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { createOrder } from "@/lib/data";
import { kirimNotifPesanan } from "@/lib/notify";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Data pesanan tidak valid." }, { status: 400 });

  try {
    const { kode, order, items } = await createOrder({
      nama: String(body.nama ?? ""),
      telepon: String(body.telepon ?? ""),
      alamat: String(body.alamat ?? ""),
      lat: body.lat,
      lng: body.lng,
      catatan: String(body.catatan ?? ""),
      metode: body.metode,
      pembayaran: body.pembayaran,
      jadwal: String(body.jadwal ?? ""),
      items: Array.isArray(body.items) ? body.items : [],
    });

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    await kirimNotifPesanan(order, items, origin);

    return NextResponse.json({ ok: true, kode }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Pesanan gagal dibuat.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

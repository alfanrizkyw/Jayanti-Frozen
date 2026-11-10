import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { deletePromotion, savePromotion } from "@/lib/data";
import type { Promotion } from "@/lib/types";

export async function POST(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data promo tidak valid.");

  try {
    const promo = await savePromotion({
      id: body.id,
      tipe: body.tipe === "pengumuman" ? "pengumuman" : "banner",
      judul: String(body.judul ?? ""),
      deskripsi: String(body.deskripsi ?? ""),
      badge: String(body.badge ?? ""),
      gambar: String(body.gambar ?? ""),
      cta: String(body.cta ?? ""),
      aktif: body.aktif !== false,
      mulai: String(body.mulai ?? ""),
      selesai: String(body.selesai ?? ""),
    });
    return NextResponse.json({ ok: true, promo: promo as Promotion });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menyimpan promo.");
  }
}

export async function DELETE(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ID promo wajib diisi.");
  await deletePromotion(id);
  return NextResponse.json({ ok: true });
}

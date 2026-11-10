import { NextResponse } from "next/server";
import sharp from "sharp";
import { bad, guard } from "@/lib/api";
import { simpanBukti } from "@/lib/bukti";
import { getOrderDetail } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { response } = await guard("kurir");
  if (response) return response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kode = String(form?.get("kode") ?? "").trim();
  if (!(file instanceof File)) return bad("Foto bukti tidak ditemukan.");
  if (!kode) return bad("Kode pesanan tidak ditemukan.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return bad("Format foto harus JPG, PNG, atau WEBP.");
  if (file.size > 10 * 1024 * 1024) return bad("Ukuran foto maksimal 10 MB.");

  let detail = await getOrderDetail(kode);
  // Cache instance lain bisa tertinggal sesaat setelah kurir menekan "Mulai antar".
  if (detail && detail.order.status !== "diantar") detail = await getOrderDetail(kode, true);
  if (!detail) return bad("Pesanan tidak ditemukan.", 404);
  if (detail.order.metode !== "antar") return bad("Pesanan ini bukan pengantaran.");
  if (detail.order.status !== "diantar")
    return bad("Foto bukti diambil saat pesanan sedang diantar.");

  let jpeg: Buffer;
  try {
    jpeg = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
  } catch {
    return bad("Foto gagal diproses. Coba ambil ulang.", 400);
  }

  try {
    await simpanBukti(detail.order.id, jpeg);
  } catch (err) {
    console.error("[jayanti] simpan foto bukti gagal:", err);
    return bad(
      err instanceof Error ? err.message : "Foto gagal disimpan. Coba lagi.",
      500,
    );
  }

  return NextResponse.json({ ok: true });
}

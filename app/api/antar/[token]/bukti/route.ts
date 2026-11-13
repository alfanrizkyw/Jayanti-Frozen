import { NextResponse } from "next/server";
import sharp from "sharp";
import { bad } from "@/lib/api";
import { simpanBuktiTugas } from "@/lib/tugas-kurir";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return bad("Foto bukti tidak ditemukan.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return bad("Format foto harus JPG, PNG, atau WEBP.");
  if (file.size > 10 * 1024 * 1024) return bad("Ukuran foto maksimal 10 MB.");

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
    await simpanBuktiTugas(decodeURIComponent(token), jpeg);
  } catch (err) {
    console.error("[jayanti] simpan foto bukti gagal:", err);
    return bad(
      err instanceof Error ? err.message : "Foto gagal disimpan. Coba lagi.",
      500,
    );
  }

  return NextResponse.json({ ok: true });
}

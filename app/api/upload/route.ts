import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { bad, guard } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { response } = await guard(["admin", "developer"]);
  if (response) return response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return bad("Berkas gambar tidak ditemukan.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return bad("Format gambar harus JPG, PNG, atau WEBP.");

  const { searchParams } = new URL(req.url);
  const qris = searchParams.get("jenis") === "qris";
  const banner = searchParams.get("rasio") === "banner";
  if (file.size > (qris ? 4 : 8) * 1024 * 1024)
    return bad(`Ukuran gambar maksimal ${qris ? 4 : 8} MB.`);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const gambar = qris
      ? await sharp(buffer)
          .rotate()
          .resize(900, 900, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .png({ compressionLevel: 9 })
          .toBuffer()
      : await sharp(buffer)
          .rotate()
          .resize(banner ? 1600 : 900, banner ? 900 : 675, {
            fit: "cover",
            position: "centre",
          })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();

    const folder = qris ? "qris" : banner ? "promo" : "produk";
    const ext = qris ? "png" : "jpg";
    const contentType = qris ? "image/png" : "image/jpeg";

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${folder}/${Date.now()}.${ext}`, gambar, {
        access: "public",
        contentType,
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL)
      return bad(
        "Upload butuh Vercel Blob. Atur BLOB_READ_WRITE_TOKEN atau tempel URL gambar.",
        500,
      );

    const name = `${folder}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), gambar);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return bad("Gambar gagal diproses. Coba file lain.", 500);
  }
}

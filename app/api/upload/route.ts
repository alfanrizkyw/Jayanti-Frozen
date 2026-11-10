import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { bad, guard } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return bad("Berkas gambar tidak ditemukan.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return bad("Format gambar harus JPG, PNG, atau WEBP.");
  if (file.size > 8 * 1024 * 1024)
    return bad("Ukuran gambar maksimal 8 MB.");

  try {
    const banner =
      new URL(req.url).searchParams.get("rasio") === "banner";
    const lebar = banner ? 1600 : 900;
    const tinggi = banner ? 900 : 675;
    const buffer = Buffer.from(await file.arrayBuffer());
    const jpeg = await sharp(buffer)
      .rotate()
      .resize(lebar, tinggi, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(
        `${banner ? "promo" : "produk"}/${Date.now()}.jpg`,
        jpeg,
        {
          access: "public",
          contentType: "image/jpeg",
          addRandomSuffix: true,
        },
      );
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL)
      return bad(
        "Upload butuh Vercel Blob. Atur BLOB_READ_WRITE_TOKEN atau tempel URL gambar.",
        500,
      );

    const name = `${banner ? "promo" : "produk"}-${Date.now()}.jpg`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), jpeg);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return bad("Gambar gagal diproses. Coba file lain.", 500);
  }
}

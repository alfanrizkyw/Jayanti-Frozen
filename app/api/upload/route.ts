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

  let gambar: Buffer;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    gambar = qris
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
  } catch {
    return bad("Gambar gagal diproses. Coba file lain.", 400);
  }

  const folder = qris ? "qris" : banner ? "promo" : "produk";
  const ext = qris ? "png" : "jpg";
  const contentType = qris ? "image/png" : "image/jpeg";

  if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const pathname = `${folder}/${Date.now()}.${ext}`;
      const opsi = { contentType, addRandomSuffix: true } as const;
      let url: string;
      try {
        const blob = await put(pathname, gambar, { ...opsi, access: "public" });
        url = blob.url;
      } catch (err) {
        // Toko Blob bisa dibuat private; unggah public akan ditolak di sana.
        if (!(err instanceof Error) || !/private store/i.test(err.message)) throw err;
        const blob = await put(pathname, gambar, { ...opsi, access: "private" });
        url = `/api/gambar?p=${encodeURIComponent(blob.pathname)}`;
      }
      return NextResponse.json({ url });
    } catch (err) {
      console.error("[jayanti] unggah Blob gagal:", err);
      return bad("Gambar gagal disimpan. Coba lagi sebentar.", 500);
    }
  }

  if (process.env.VERCEL)
    return bad(
      "Unggah file belum aktif karena Blob belum tersambung ke proyek ini. Buka Vercel → Storage → Blob → Connect to Project pada proyek yang menampilkan toko, lalu redeploy. Sementara itu tempel tautan gambar di kolom URL.",
      503,
    );

  try {
    const name = `${folder}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), gambar);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return bad("Gambar gagal disimpan. Coba lagi sebentar.", 500);
  }
}

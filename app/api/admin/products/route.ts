import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { deleteProduct, saveProduct } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data produk tidak valid.");

  try {
    const produk = await saveProduct({
      id: body.id,
      nama: String(body.nama ?? ""),
      kategori: String(body.kategori ?? ""),
      harga: Number(body.harga),
      hargaPromo:
        body.hargaPromo === null || body.hargaPromo === ""
          ? null
          : Number(body.hargaPromo),
      satuan: String(body.satuan ?? ""),
      stok: Number(body.stok),
      deskripsi: String(body.deskripsi ?? ""),
      gambar: String(body.gambar ?? ""),
      unggulan: Boolean(body.unggulan),
      aktif: body.aktif !== false,
    });
    return NextResponse.json({ ok: true, produk });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menyimpan produk.");
  }
}

export async function DELETE(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ID produk wajib diisi.");
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}

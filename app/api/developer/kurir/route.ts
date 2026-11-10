import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { deleteCourierAccount, saveCourierAccount } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("developer");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data kurir tidak valid.");

  try {
    if (body.aksi === "hapus") {
      await deleteCourierAccount(String(body.id ?? ""));
      return NextResponse.json({ ok: true });
    }
    const kurir = await saveCourierAccount({
      id: body.id ? String(body.id) : undefined,
      nama: String(body.nama ?? ""),
      telepon: String(body.telepon ?? ""),
      kendaraan: String(body.kendaraan ?? ""),
      sandi: body.sandi ? String(body.sandi) : undefined,
      aktif: typeof body.aktif === "boolean" ? body.aktif : undefined,
    });
    return NextResponse.json({ ok: true, kurir });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menyimpan akun kurir.");
  }
}

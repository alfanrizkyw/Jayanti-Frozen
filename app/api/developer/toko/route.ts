import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { getSettings, updateSettings } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("developer");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data toko tidak valid.");

  try {
    const sekarang = await getSettings();
    const settings = await updateSettings({
      ...sekarang,
      telepon:
        typeof body.telepon === "string" ? body.telepon : sekarang.telepon,
      qrisNama:
        typeof body.qrisNama === "string" ? body.qrisNama : sekarang.qrisNama,
      qrisGambar:
        typeof body.qrisGambar === "string"
          ? body.qrisGambar
          : sekarang.qrisGambar,
      bank: Array.isArray(body.bank) ? body.bank : sekarang.bank,
    });
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menyimpan data toko.");
  }
}

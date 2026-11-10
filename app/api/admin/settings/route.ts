import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { getSettings, updateSettings } from "@/lib/data";
import type { Settings } from "@/lib/types";

export async function POST(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data pengaturan tidak valid.");

  try {
    const sekarang = await getSettings();
    const settings = await updateSettings({
      namaToko: String(body.namaToko ?? "Jayanti Frozen"),
      telepon: String(body.telepon ?? ""),
      alamat: String(body.alamat ?? ""),
      mapsUrl:
        typeof body.mapsUrl === "string" ? body.mapsUrl : sekarang.mapsUrl,
      jamBuka: String(body.jamBuka ?? ""),
      ongkir: Number(body.ongkir),
      gratisOngkirMin: Number(body.gratisOngkirMin),
      rekening: String(body.rekening ?? ""),
      atasNama: String(body.atasNama ?? ""),
      qrisNama: String(body.qrisNama ?? ""),
      qrisGambar:
        typeof body.qrisGambar === "string"
          ? body.qrisGambar
          : sekarang.qrisGambar,
      bank: Array.isArray(body.bank) ? body.bank : sekarang.bank,
      estimasiAntar: Number(body.estimasiAntar),
      whatsappAdmin: String(body.whatsappAdmin ?? ""),
      tokoBuka: body.tokoBuka !== false,
      tutupCatatan: String(body.tutupCatatan ?? ""),
      jadwalKirim: Array.isArray(body.jadwalKirim)
        ? body.jadwalKirim.map(String)
        : String(body.jadwalKirim ?? "")
            .split(/\r?\n/)
            .map((s: string) => s.trim())
            .filter(Boolean),
    } satisfies Settings);
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menyimpan pengaturan.");
  }
}

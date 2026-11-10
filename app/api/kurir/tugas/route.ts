import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { courierFinish, courierStart } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("kurir");
  if (response) return response;

  const body = await req.json().catch(() => ({}));
  const aksi = String(body.aksi ?? "");
  const kode = String(body.kode ?? "");

  try {
    if (aksi === "mulai") await courierStart(kode);
    else if (aksi === "selesai") await courierFinish(kode);
    else return bad("Aksi tidak dikenal.");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal memperbarui tugas.");
  }
}

import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { setStoreOpen } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("admin");
  if (response) return response;

  const body = await req.json().catch(() => ({}));
  if (typeof body?.buka !== "boolean") return bad("Status toko tidak valid.");

  try {
    const settings = await setStoreOpen(body.buka);
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal mengubah status toko.");
  }
}

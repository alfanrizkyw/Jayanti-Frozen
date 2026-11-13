import { NextResponse } from "next/server";
import { bad } from "@/lib/api";
import { selesaikanTugas } from "@/lib/tugas-kurir";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  try {
    await selesaikanTugas(decodeURIComponent(token));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menutup tugas.");
  }
}

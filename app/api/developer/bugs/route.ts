import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { hapusBug, ubahStatusBug } from "@/lib/data";
import type { BugStatus } from "@/lib/types";

export async function POST(req: Request) {
  const { response } = await guard("developer");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data bug tidak valid.");

  try {
    if (body.aksi === "hapus") {
      await hapusBug(String(body.id ?? ""));
      return NextResponse.json({ ok: true });
    }
    const bug = await ubahStatusBug(
      String(body.id ?? ""),
      String(body.status ?? "") as BugStatus,
    );
    return NextResponse.json({ ok: true, bug });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal memperbarui bug.");
  }
}

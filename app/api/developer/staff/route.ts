import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { deleteStaffAccount, saveStaffAccount } from "@/lib/data";

export async function POST(req: Request) {
  const { response } = await guard("developer");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data akun tidak valid.");

  try {
    if (body.aksi === "hapus") {
      await deleteStaffAccount(String(body.id ?? ""));
      return NextResponse.json({ ok: true });
    }
    const staff = await saveStaffAccount({
      id: body.id ? String(body.id) : undefined,
      nama: String(body.nama ?? ""),
      telepon: String(body.telepon ?? ""),
      sandi: body.sandi ? String(body.sandi) : undefined,
      aktif: typeof body.aktif === "boolean" ? body.aktif : undefined,
    });
    return NextResponse.json({ ok: true, staff });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal menyimpan akun admin.");
  }
}

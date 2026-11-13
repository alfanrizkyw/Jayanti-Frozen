import { NextResponse } from "next/server";
import { bad, guard } from "@/lib/api";
import { updateOrder } from "@/lib/data";
import type { OrderStatus, PaymentMethod } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { response } = await guard("admin");
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Data perubahan tidak valid.");

  const { kode } = await params;
  try {
    const hasil = await updateOrder(decodeURIComponent(kode), {
      status: body.status as OrderStatus | undefined,
      dibayar: typeof body.dibayar === "boolean" ? body.dibayar : undefined,
      kurirId: typeof body.kurirId === "string" ? body.kurirId : undefined,
      pembayaran:
        typeof body.pembayaran === "string"
          ? (body.pembayaran as PaymentMethod)
          : undefined,
    });
    return NextResponse.json({ ok: true, ...hasil });
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Gagal memperbarui pesanan.");
  }
}

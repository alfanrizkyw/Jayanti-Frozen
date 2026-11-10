import { NextResponse } from "next/server";
import { readDB } from "@/lib/store";
import { bacaBukti } from "@/lib/bukti";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const db = await readDB();
  const order = db.orders.find((o) => o.id === orderId);
  const delivery = order
    ? db.deliveries.find((d) => d.orderId === order.id)
    : null;

  // Bukti hanya dibuka setelah pengantaran benar-benar selesai.
  if (!order || order.status !== "selesai" || delivery?.status !== "selesai")
    return new NextResponse("Not found", { status: 404 });

  const hasil = await bacaBukti(order.id);
  if (!hasil) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(hasil.body as BodyInit, {
    headers: {
      "Content-Type": hasil.contentType,
      "Cache-Control": "private, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

import { notFound } from "next/navigation";
import { AdminOrderPanel } from "@/components/admin/order-panel";
import { courierPublic, getAdminData } from "@/lib/data";
import { tautanTugas } from "@/lib/tugas-kurir";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  return { title: `Pesanan ${decodeURIComponent(kode)} · Admin` };
}

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const db = await getAdminData(true);
  const order = db.orders.find(
    (o) => o.kode.toLowerCase() === decodeURIComponent(kode).toLowerCase(),
  );
  if (!order) notFound();

  return (
    <AdminOrderPanel
      order={order}
      items={db.orderItems.filter((i) => i.orderId === order.id)}
      delivery={db.deliveries.find((d) => d.orderId === order.id) ?? null}
      kurir={(() => {
        const k = db.couriers.find((c) => c.id === order.kurirId);
        return k ? courierPublic(k) : null;
      })()}
      couriers={db.couriers.map(courierPublic)}
      settings={db.settings}
      tautanKurir={order.metode === "antar" ? tautanTugas(order) : ""}
    />
  );
}

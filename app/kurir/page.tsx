import { redirect } from "next/navigation";
import { CourierBoard } from "@/components/kurir/courier-board";
import { getSession } from "@/lib/auth";
import { getCourierData } from "@/lib/data";

export const metadata = { title: "Tugas antar" };
export const dynamic = "force-dynamic";

export default async function KurirPage() {
  const session = await getSession();
  if (!session || session.role !== "kurir") redirect("/kurir/masuk");

  const data = await getCourierData(true);
  if (!data) redirect("/kurir/masuk");

  return (
    <CourierBoard
      orders={data.orders}
      riwayat={data.riwayat}
      items={data.items}
      deliveries={data.deliveries}
      settings={data.settings}
    />
  );
}

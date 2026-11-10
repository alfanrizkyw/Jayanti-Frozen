import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/data";
import { OrderView } from "@/components/order-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kode: string }>;
}): Promise<Metadata> {
  const { kode } = await params;
  return { title: `Pesanan ${decodeURIComponent(kode)}` };
}

export default async function PesananPage({
  params,
  searchParams,
}: {
  params: Promise<{ kode: string }>;
  searchParams: Promise<{ baru?: string }>;
}) {
  const { kode } = await params;
  const sp = await searchParams;
  const detail = await getOrderDetail(decodeURIComponent(kode));
  if (!detail) notFound();

  return (
    <OrderView
      baru={sp.baru === "1"}
      initial={{
        order: detail.order,
        items: detail.items,
        delivery: detail.delivery,
        kurir: detail.kurir
          ? {
              id: detail.kurir.id,
              nama: detail.kurir.nama,
              kendaraan: detail.kurir.kendaraan,
              rating: detail.kurir.rating,
              telepon: detail.kurir.telepon,
            }
          : null,
        settings: detail.settings,
      }}
    />
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ChevronRight, History, LifeBuoy, Search } from "lucide-react";
import { getOrderDetail } from "@/lib/data";
import { OrderHistory } from "@/components/order-history";

export const metadata: Metadata = {
  title: "Riwayat pesanan",
  description:
    "Pesanan Yanti Frozen di perangkat ini muncul otomatis, tanpa kode dan tanpa memasukkan nomor HP.",
};

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  const sp = await searchParams;
  const kode = (sp.kode ?? "").trim();

  if (kode) {
    const detail = await getOrderDetail(kode);
    if (detail) redirect(`/pesanan/${detail.order.kode}`);
  }

  return (
    <div className="container-page pt-5 md:pt-8">
      <div className="mx-auto max-w-[640px]">
        <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-card">
          <div className="relative bg-navy px-5 py-6 text-white md:px-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgba(114,185,238,0.3),transparent_65%)]"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sky">
              <History size={21} />
            </span>
            <h1 className="relative mt-3 text-[24px] font-extrabold md:text-[28px]">
              Riwayat pesanan
            </h1>
            <p className="relative mt-1 max-w-[430px] text-[12.5px] leading-relaxed text-white/70">
              Pesanan dari perangkat ini terbaca otomatis. Tanpa kode, tanpa
              mengetik nomor HP. Pesanan lama bisa dibuka rinciannya.
            </p>
          </div>

          <div className="px-5 pb-6 pt-1 md:px-6">
            <OrderHistory />

            <details className="group mt-8 border-t border-line pt-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-1 text-[13px] font-bold text-navy">
                Punya kode pesanan?
                <ChevronRight
                  size={16}
                  className="text-muted transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                Masukkan kode dari struk atau pesan WhatsApp toko.
              </p>

              <form action="/lacak" method="get" role="search" className="mt-3">
                <label htmlFor="kode" className="label">
                  Kode pesanan
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      id="kode"
                      name="kode"
                      placeholder="YF261110-4821"
                      className="field pl-10 uppercase placeholder:normal-case"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-outline sm:px-6">
                    Cari kode
                  </button>
                </div>
              </form>

              {kode && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#F3DFBC] bg-[#FFF8EC] px-3.5 py-3 text-[12px] text-[#8A520B]">
                  <LifeBuoy size={15} className="mt-0.5 flex-none" />
                  Pesanan dengan kode itu tidak ditemukan. Periksa kembali huruf
                  dan angkanya, atau hubungi toko.
                </div>
              )}
            </details>
          </div>
        </div>

        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-muted">
          Data pesanan hanya tersimpan di perangkat ini, tidak dibagikan ke
          perangkat lain.
        </p>
      </div>
    </div>
  );
}

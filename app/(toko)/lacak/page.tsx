import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  LifeBuoy,
  MapPin,
  PackageSearch,
  Search,
} from "lucide-react";
import { getOrderDetail } from "@/lib/data";

export const metadata: Metadata = {
  title: "Lacak pesanan",
  description:
    "Masukkan kode pesanan Jayanti Frozen untuk melihat status dan posisi kurir.",
};

export default async function LacakPage({
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
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-muted">
        <Link href="/" className="hover:text-navy">Beranda</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-navy">Lacak pesanan</span>
      </nav>

      <div className="mx-auto mt-5 max-w-[640px]">
        <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-card">
          <div className="relative bg-navy px-5 py-6 text-white md:px-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgba(114,185,238,0.3),transparent_65%)]"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sky">
              <PackageSearch size={21} />
            </span>
            <h1 className="relative mt-3 text-[24px] font-extrabold md:text-[28px]">
              Lacak pesanan Anda
            </h1>
            <p className="relative mt-1 max-w-[420px] text-[12.5px] leading-relaxed text-white/70">
              Masukkan kode pesanan yang tertera saat checkout. Contoh:
              JY261110-4821.
            </p>
          </div>

          <div className="p-5 md:p-6">
            <form action="/lacak" method="get" role="search">
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
                    defaultValue={kode}
                    placeholder="JY261110-4821"
                    className="field pl-10 uppercase placeholder:normal-case"
                    autoComplete="off"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary sm:px-6">
                  Lacak
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

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-brand" /> Status diperbarui oleh admin
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-brand" /> Lokasi kurir saat pengantaran
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] border border-[#C9E1F7] bg-mist p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12.5px] font-extrabold text-navy">
                Ingin melihat contoh pelacakan?
              </p>
              <p className="mt-0.5 text-[11.5px] text-navy/65">
                Buka pesanan demo yang sedang diantar kurir.
              </p>
            </div>
            <Link href="/pesanan/JY-DEMO-001" className="btn btn-outline btn-sm bg-white">
              Lihat demo <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-muted">
          Simpan kode pesanan Anda. Tanpa akun, kode ini yang dipakai untuk
          membuka status dan posisi kurir kapan saja.
        </p>
      </div>
    </div>
  );
}

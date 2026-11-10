import Link from "next/link";
import { Bike, ChevronRight, PackageSearch, Search, Store } from "lucide-react";
import { PaymentBadge } from "@/components/payment-badge";
import { OrderStatusBadge } from "@/components/status-badge";
import { getAdminData } from "@/lib/data";
import { inisial, rupiah, tanggalJam } from "@/lib/format";
import { STATUS_LABEL, type OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pesanan · Admin" };

const TABS: { key: string; label: string }[] = [
  { key: "", label: "Semua" },
  { key: "baru", label: "Masuk" },
  { key: "dikonfirmasi", label: "Dikonfirmasi" },
  { key: "disiapkan", label: "Disiapkan" },
  { key: "siap", label: "Siap" },
  { key: "diantar", label: "Diantar" },
  { key: "selesai", label: "Selesai" },
  { key: "batal", label: "Batal" },
];

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const [db, query] = await Promise.all([getAdminData(), searchParams]);
  const status = query.status && STATUS_LABEL[query.status as OrderStatus] ? query.status : "";
  const q = (query.q ?? "").trim().toLowerCase();

  const semua = [...db.orders].sort((a, b) => b.dibuat.localeCompare(a.dibuat));
  const terfilter = semua.filter((o) => {
    if (status && o.status !== status) return false;
    if (!q) return true;
    return (
      o.kode.toLowerCase().includes(q) ||
      o.pelanggan.toLowerCase().includes(q) ||
      o.telepon.includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Operasional</p>
        <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[28px]">Pesanan</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          Kelola status, verifikasi pembayaran, dan tugaskan kurir.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pb-1" role="tablist" aria-label="Filter status pesanan">
        {TABS.map((tab) => {
          const n = tab.key
            ? semua.filter((o) => o.status === tab.key).length
            : semua.length;
          const on = status === tab.key;
          const href = `/admin/pesanan${tab.key ? `?status=${tab.key}` : ""}${
            q && tab.key ? `&q=${encodeURIComponent(query.q ?? "")}` : ""
          }`;
          return (
            <Link
              key={tab.key || "semua"}
              href={href}
              role="tab"
              aria-selected={on}
              className={`chip flex-none ${on ? "chip-active" : ""}`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  on ? "bg-white/20 text-white" : "bg-paper text-muted"
                }`}
              >
                {n}
              </span>
            </Link>
          );
        })}
      </div>

      <form action="/admin/pesanan" className="card flex items-center gap-2 p-2.5">
        {status && <input type="hidden" name="status" value={status} />}
        <Search size={17} className="ml-1 flex-none text-muted" />
        <input
          name="q"
          defaultValue={query.q ?? ""}
          placeholder="Cari kode pesanan, nama, atau nomor HP"
          className="min-h-10 w-full min-w-0 border-0 bg-transparent px-1 text-[13px] text-ink outline-none placeholder:text-[#93a3b6]"
          aria-label="Cari pesanan"
        />
        <button type="submit" className="btn btn-sm btn-outline flex-none">
          Cari
        </button>
      </form>

      {terfilter.length === 0 ? (
        <div className="card flex flex-col items-center px-5 py-14 text-center">
          <PackageSearch size={28} className="text-brand" />
          <p className="mt-3 text-[14px] font-bold text-navy">Pesanan tidak ditemukan</p>
          <p className="mt-1 max-w-[320px] text-[12px] leading-relaxed text-muted">
            Coba ubah filter status atau kata kunci pencarian.
          </p>
          <Link href="/admin/pesanan" className="btn btn-outline btn-sm mt-4">
            Tampilkan semua
          </Link>
        </div>
      ) : (
        <>
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-paper/70 text-[10.5px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-3 font-extrabold">Pesanan</th>
                  <th className="px-4 py-3 font-extrabold">Waktu</th>
                  <th className="px-4 py-3 font-extrabold">Metode</th>
                  <th className="px-4 py-3 font-extrabold">Total</th>
                  <th className="px-4 py-3 font-extrabold">Pembayaran</th>
                  <th className="px-4 py-3 font-extrabold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {terfilter.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-paper/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-mist text-[10px] font-extrabold text-brand">
                          {inisial(o.pelanggan)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-bold text-navy">{o.pelanggan}</p>
                          <p className="text-[10.5px] text-muted">{o.kode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">{tanggalJam(o.dibuat)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-navy">
                        {o.metode === "antar" ? <Bike size={13} /> : <Store size={13} />}
                        {o.metode === "antar" ? "Antar" : "Ambil"}
                      </span>
                    </td>
                    <td className="stat-num px-4 py-3 text-[12px] font-extrabold text-navy">
                      {rupiah(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge metode={o.pembayaran} dibayar={o.dibayar} />
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/pesanan/${o.kode}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-brand hover:bg-mist"
                        aria-label={`Buka pesanan ${o.kode}`}
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2.5 md:hidden">
            {terfilter.map((o) => (
              <Link
                key={o.id}
                href={`/admin/pesanan/${o.kode}`}
                className="card block p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold text-navy">{o.pelanggan}</p>
                    <p className="text-[10.5px] text-muted">
                      {o.kode} · {tanggalJam(o.dibuat)}
                    </p>
                  </div>
                  <p className="stat-num flex-none text-[13px] font-extrabold text-navy">
                    {rupiah(o.total)}
                  </p>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <OrderStatusBadge status={o.status} />
                  <PaymentBadge metode={o.pembayaran} dibayar={o.dibayar} />
                  <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted">
                    {o.metode === "antar" ? <Bike size={12} /> : <Store size={12} />}
                    {o.metode === "antar" ? "Antar" : "Ambil"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="text-center text-[11px] text-muted">
        Menampilkan {terfilter.length} dari {semua.length} pesanan
      </p>
    </div>
  );
}

import Link from "next/link";
import { Bike, Banknote, Store, TrendingUp, Wallet } from "lucide-react";
import { ExportCsv } from "@/components/admin/export-csv";
import { OrderStatusBadge } from "@/components/status-badge";
import { PaymentBadge } from "@/components/payment-badge";
import { getAdminData } from "@/lib/data";
import {
  hariPendek,
  kunciHari,
  rupiah,
  tanggalJam,
} from "@/lib/format";
import { PAYMENT_LABEL, STATUS_LABEL, type PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Laporan · Admin" };

const PERIODE = [7, 30, 90] as const;

export default async function AdminReports({
  searchParams,
}: {
  searchParams: Promise<{ hari?: string }>;
}) {
  const [db, query] = await Promise.all([getAdminData(), searchParams]);
  const hari = PERIODE.includes(Number(query.hari) as (typeof PERIODE)[number])
    ? Number(query.hari)
    : 7;

  const mulai = new Date(`${kunciHari(new Date(Date.now() - (hari - 1) * 86400000))}T00:00:00+07:00`);
  const pesanan = db.orders
    .filter((o) => new Date(o.dibuat).getTime() >= mulai.getTime())
    .sort((a, b) => b.dibuat.localeCompare(a.dibuat));
  const sah = pesanan.filter((o) => o.status !== "batal");
  const omzet = sah.reduce((n, o) => n + o.total, 0);
  const rata = sah.length ? Math.round(omzet / sah.length) : 0;
  const itemIds = new Set(sah.map((o) => o.id));
  const itemSah = db.orderItems.filter((i) => itemIds.has(i.orderId));
  const unitTerjual = itemSah.reduce((n, i) => n + i.jumlah, 0);
  const selesai = sah.filter((o) => o.status === "selesai").length;

  const produk = new Map<string, { nama: string; jumlah: number; omzet: number }>();
  for (const it of itemSah) {
    const row = produk.get(it.produkId) ?? { nama: it.nama, jumlah: 0, omzet: 0 };
    row.jumlah += it.jumlah;
    row.omzet += it.harga * it.jumlah;
    produk.set(it.produkId, row);
  }
  const teratas = [...produk.values()].sort((a, b) => b.jumlah - a.jumlah).slice(0, 6);
  const maxTerjual = Math.max(1, ...teratas.map((p) => p.jumlah));

  const chart = Array.from({ length: hari }, (_, i) => {
    const date = new Date(Date.now() - (hari - 1 - i) * 86400000);
    const kunci = kunciHari(date);
    const rows = sah.filter((o) => kunciHari(o.dibuat) === kunci);
    return {
      kunci,
      label: hariPendek(date.toISOString()),
      tanggal: Number(kunci.slice(-2)),
      omzet: rows.reduce((n, o) => n + o.total, 0),
      jumlah: rows.length,
    };
  });
  const maxOmzet = Math.max(1, ...chart.map((c) => c.omzet));

  const bayar = (["tunai", "qris", "transfer"] as PaymentMethod[]).map((m) => {
    const rows = sah.filter((o) => o.pembayaran === m);
    return {
      metode: m,
      label: PAYMENT_LABEL[m],
      jumlah: rows.length,
      total: rows.reduce((n, o) => n + o.total, 0),
    };
  });
  const totalBayar = Math.max(1, ...bayar.map((b) => b.total));

  const antar = sah.filter((o) => o.metode === "antar").length;
  const ambil = sah.filter((o) => o.metode === "ambil").length;

  const csv: (string | number)[][] = [
    [
      "Kode",
      "Tanggal",
      "Pelanggan",
      "Telepon",
      "Metode",
      "Pembayaran",
      "Lunas",
      "Subtotal",
      "Ongkir",
      "Total",
      "Status",
    ],
    ...pesanan.map((o) => [
      o.kode,
      tanggalJam(o.dibuat),
      o.pelanggan,
      o.telepon,
      o.metode === "antar" ? "Antar" : "Ambil",
      PAYMENT_LABEL[o.pembayaran],
      o.dibayar ? "Ya" : "Belum",
      o.subtotal,
      o.ongkir,
      o.total,
      STATUS_LABEL[o.status],
    ]),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Analitik</p>
          <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[28px]">
            Laporan penjualan
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Pilih rentang waktu, lalu unduh riwayat transaksi bila perlu.
          </p>
        </div>
        <ExportCsv
          nama={`laporan-jayanti-${hari}hari.csv`}
          baris={csv}
          label="Unduh riwayat CSV"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PERIODE.map((p) => (
          <Link
            key={p}
            href={`/admin/laporan?hari=${p}`}
            className={`chip ${hari === p ? "chip-active" : ""}`}
            aria-current={hari === p ? "page" : undefined}
          >
            {p} hari terakhir
          </Link>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Omzet",
            nilai: rupiah(omzet),
            sub: `${sah.length} pesanan sah`,
            icon: Wallet,
            tone: "bg-leaf-soft text-leaf",
          },
          {
            label: "Rata-rata pesanan",
            nilai: rupiah(rata),
            sub: "per transaksi",
            icon: TrendingUp,
            tone: "bg-mist text-brand",
          },
          {
            label: "Produk terjual",
            nilai: `${unitTerjual} item`,
            sub: `${produk.size} produk berbeda`,
            icon: Store,
            tone: "bg-[#EDF4FF] text-navy",
          },
          {
            label: "Pesanan selesai",
            nilai: String(selesai),
            sub: `${pesanan.length - sah.length} dibatalkan`,
            icon: Banknote,
            tone: "bg-[#FFF4E3] text-[#8A520B]",
          },
        ].map(({ label, nilai, sub, icon: Icon, tone }) => (
          <div key={label} className="card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={17} />
            </div>
            <p className="mt-3 text-[11.5px] font-semibold text-muted">{label}</p>
            <p className="stat-num mt-0.5 text-[19px] font-extrabold text-navy md:text-[22px]">
              {nilai}
            </p>
            <p className="mt-1 text-[10.5px] leading-tight text-muted">{sub}</p>
          </div>
        ))}
      </section>

      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-extrabold text-navy">
              Omzet harian · {hari} hari
            </h2>
            <p className="mt-0.5 text-[11.5px] text-muted">
              Pesanan batal tidak dihitung.
            </p>
          </div>
          <p className="stat-num text-[18px] font-extrabold text-navy">{rupiah(omzet)}</p>
        </div>
        <div className="mt-5 flex h-[160px] items-stretch gap-[3px]">
          {chart.map((c) => {
            const tinggi = Math.max(2, Math.round((c.omzet / maxOmzet) * 100));
            const tunjuk = hari <= 7 || c.tanggal === 1 || chart.indexOf(c) === chart.length - 1;
            return (
              <div key={c.kunci} className="group flex h-full min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-[#BBD8F1] transition-colors group-hover:bg-brand"
                    style={{ height: `${tinggi}%` }}
                    title={`${c.label} ${c.tanggal}: ${rupiah(c.omzet)} · ${c.jumlah} pesanan`}
                  />
                </div>
                <span className="h-3 text-[8.5px] font-bold text-muted">
                  {tunjuk ? c.tanggal : ""}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="card overflow-hidden">
          <div className="border-b border-line px-4 py-3.5 md:px-5">
            <h2 className="text-[15px] font-extrabold text-navy">Produk terlaris</h2>
            <p className="mt-0.5 text-[11.5px] text-muted">
              Berdasarkan jumlah item terjual pada periode ini.
            </p>
          </div>
          <ul className="space-y-3 p-4 md:p-5">
            {teratas.map((p) => (
              <li key={p.nama}>
                <div className="flex items-baseline justify-between gap-3 text-[12px]">
                  <span className="min-w-0 truncate font-bold text-navy">{p.nama}</span>
                  <span className="flex-none font-extrabold text-navy">
                    {p.jumlah} item
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(p.jumlah / maxTerjual) * 100}%` }}
                  />
                </div>
                <div className="mt-0.5 flex justify-between text-[10px] text-muted">
                  <span>Kontribusi omzet</span>
                  <span className="stat-num">{rupiah(p.omzet)}</span>
                </div>
              </li>
            ))}
            {teratas.length === 0 && (
              <li className="py-8 text-center text-[12px] text-muted">
                Belum ada penjualan pada periode ini.
              </li>
            )}
          </ul>
        </section>

        <div className="space-y-4">
          <section className="card p-4 md:p-5">
            <h2 className="text-[15px] font-extrabold text-navy">Metode pembayaran</h2>
            <ul className="mt-3 space-y-3">
              {bayar.map((b) => (
                <li key={b.metode}>
                  <div className="flex items-baseline justify-between gap-2 text-[11.5px]">
                    <span className="font-semibold text-navy">{b.label}</span>
                    <span className="stat-num font-extrabold text-navy">
                      {rupiah(b.total)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
                    <div
                      className={`h-full rounded-full ${
                        b.metode === "tunai"
                          ? "bg-[#F2A03A]"
                          : b.metode === "qris"
                            ? "bg-brand"
                            : "bg-leaf"
                      }`}
                      style={{ width: `${(b.total / totalBayar) * 100}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted">{b.jumlah} pesanan</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-4 md:p-5">
            <h2 className="text-[15px] font-extrabold text-navy">Cara menerima pesanan</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-paper px-3 py-3">
                <Bike size={16} className="text-brand" />
                <p className="stat-num mt-1.5 text-[20px] font-extrabold text-navy">{antar}</p>
                <p className="text-[10.5px] text-muted">Diantar kurir</p>
              </div>
              <div className="rounded-xl bg-paper px-3 py-3">
                <Store size={16} className="text-brand" />
                <p className="stat-num mt-1.5 text-[20px] font-extrabold text-navy">{ambil}</p>
                <p className="text-[10.5px] text-muted">Ambil di toko</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3.5 md:px-5">
          <div>
            <h2 className="text-[15px] font-extrabold text-navy">Riwayat transaksi</h2>
            <p className="mt-0.5 text-[11.5px] text-muted">
              {pesanan.length} pesanan pada periode ini.
            </p>
          </div>
          <Link href="/admin/pesanan" className="text-[11.5px] font-bold text-brand">
            Kelola pesanan
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line bg-paper/70 text-[10px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-2.5 font-extrabold">Kode</th>
                <th className="px-4 py-2.5 font-extrabold">Tanggal</th>
                <th className="px-4 py-2.5 font-extrabold">Pelanggan</th>
                <th className="px-4 py-2.5 font-extrabold">Total</th>
                <th className="px-4 py-2.5 font-extrabold">Bayar</th>
                <th className="px-4 py-2.5 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pesanan.slice(0, 20).map((o) => (
                <tr key={o.id} className="hover:bg-paper/60">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/admin/pesanan/${o.kode}`}
                      className="text-[11.5px] font-bold text-brand hover:text-brand-dark"
                    >
                      {o.kode}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-muted">{tanggalJam(o.dibuat)}</td>
                  <td className="px-4 py-2.5 text-[11.5px] font-semibold text-navy">
                    {o.pelanggan}
                  </td>
                  <td className="stat-num px-4 py-2.5 text-[11.5px] font-extrabold text-navy">
                    {rupiah(o.total)}
                  </td>
                  <td className="px-4 py-2.5">
                    <PaymentBadge metode={o.pembayaran} dibayar={o.dibayar} />
                  </td>
                  <td className="px-4 py-2.5">
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pesanan.length === 0 && (
          <p className="px-5 py-10 text-center text-[12px] text-muted">
            Tidak ada transaksi pada periode ini.
          </p>
        )}
        {pesanan.length > 20 && (
          <p className="border-t border-line px-4 py-2.5 text-center text-[10.5px] text-muted">
            Menampilkan 20 terbaru. Unduh CSV untuk melihat semua.
          </p>
        )}
      </section>
    </div>
  );
}

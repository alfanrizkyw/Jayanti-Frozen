import Link from "next/link";
import {
  ArrowRight,
  Bike,
  CircleAlert,
  Package,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AvatarPeran } from "@/components/avatar-peran";
import { QuickPaid } from "@/components/admin/quick-paid";
import { StoreToggle } from "@/components/admin/store-toggle";
import { AutoRefresh } from "@/components/auto-refresh";
import { OrderStatusBadge } from "@/components/status-badge";
import { getAdminData } from "@/lib/data";
import {
  hariPendek,
  inisial,
  kunciHari,
  relatif,
  rupiah,
  tanggalPanjang,
} from "@/lib/format";
import { PAYMENT_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const db = await getAdminData(true);
  const hariIni = kunciHari();
  const pesanan = [...db.orders].sort((a, b) => b.dibuat.localeCompare(a.dibuat));

  const hariIniOrders = pesanan.filter((o) => kunciHari(o.dibuat) === hariIni);
  const omzetHariIni = hariIniOrders
    .filter((o) => o.status !== "batal")
    .reduce((n, o) => n + o.total, 0);
  const baru = db.orders.filter((o) => o.status === "baru").length;
  const verifikasi = pesanan.filter(
    (o) => o.pembayaran !== "tunai" && !o.dibayar && o.status !== "batal",
  );
  const diantar = db.orders.filter((o) => o.status === "diantar");

  const chart = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const kunci = kunciHari(date);
    const rows = db.orders.filter(
      (o) => kunciHari(o.dibuat) === kunci && o.status !== "batal",
    );
    return {
      kunci,
      label: hariPendek(date.toISOString()),
      tanggal: Number(kunci.slice(-2)),
      omzet: rows.reduce((n, o) => n + o.total, 0),
      jumlah: rows.length,
    };
  });
  const maxOmzet = Math.max(1, ...chart.map((c) => c.omzet));
  const total7 = chart.reduce((n, c) => n + c.omzet, 0);

  const stokTipis = db.products
    .filter((p) => p.aktif && p.stok <= 5)
    .sort((a, b) => a.stok - b.stok)
    .slice(0, 4);

  return (
    <div className="space-y-5">
      <AutoRefresh detik={6} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Ringkasan hari ini</p>
          <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[30px]">
            Selamat datang, Admin
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            {tanggalPanjang()} · data toko diperbarui otomatis
          </p>
        </div>
        <Link href="/admin/pesanan?status=baru" className="btn btn-primary">
          Proses pesanan baru <ArrowRight size={15} />
        </Link>
      </div>

      <StoreToggle
        buka={db.settings.tokoBuka}
        jamBuka={db.settings.jamBuka}
        tutupCatatan={db.settings.tutupCatatan}
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Pesanan hari ini",
            nilai: String(hariIniOrders.length),
            catatan: `${baru} pesanan belum diproses`,
            icon: ReceiptText,
            tone: "bg-mist text-brand",
          },
          {
            label: "Omzet hari ini",
            nilai: rupiah(omzetHariIni),
            catatan: `${hariIniOrders.filter((o) => o.status === "selesai").length} pesanan selesai`,
            icon: Wallet,
            tone: "bg-leaf-soft text-leaf",
          },
          {
            label: "Perlu verifikasi",
            nilai: String(verifikasi.length),
            catatan: "Pembayaran QRIS / transfer",
            icon: ShieldCheck,
            tone: "bg-[#FFF4E3] text-[#8A520B]",
          },
          {
            label: "Sedang diantar",
            nilai: String(diantar.length),
            catatan: diantar.length
              ? "Kurir di jalan"
              : "Tidak ada pengantaran aktif",
            icon: Bike,
            tone: "bg-[#EDF4FF] text-navy",
          },
        ].map(({ label, nilai, catatan, icon: Icon, tone }) => (
          <div key={label} className="card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={17} />
            </div>
            <p className="mt-3 text-[11.5px] font-semibold text-muted">{label}</p>
            <p className="stat-num mt-0.5 whitespace-nowrap text-[18px] font-extrabold text-navy sm:text-[20px] md:text-[24px]">
              {nilai}
            </p>
            <p className="mt-1 text-[10.5px] leading-tight text-muted">{catatan}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="card p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-[15px] font-extrabold text-navy">Penjualan 7 hari terakhir</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Tidak termasuk pesanan yang dibatalkan.
              </p>
            </div>
            <div className="text-right">
              <p className="stat-num text-[18px] font-extrabold text-navy">{rupiah(total7)}</p>
              <p className="flex items-center justify-end gap-1 text-[10.5px] font-semibold text-leaf">
                <TrendingUp size={12} /> total 7 hari
              </p>
            </div>
          </div>

          <div className="mt-5 flex h-[170px] items-stretch gap-2 sm:gap-3">
            {chart.map((c, i) => {
              const tinggi = Math.max(3, Math.round((c.omzet / maxOmzet) * 100));
              const hariIniBar = i === chart.length - 1;
              return (
                <div key={c.kunci} className="group flex h-full min-w-0 flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`relative w-full rounded-t-lg transition-all ${
                        hariIniBar ? "bg-brand" : "bg-[#BBD8F1] group-hover:bg-sky"
                      }`}
                      style={{ height: `${tinggi}%` }}
                      title={`${c.label} ${c.tanggal}: ${rupiah(c.omzet)} · ${c.jumlah} pesanan`}
                    >
                      <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-1.5 py-0.5 text-[9px] font-bold text-white group-hover:block">
                        {c.omzet > 0 ? rupiah(c.omzet) : "—"}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-[10px] font-bold ${
                      hariIniBar ? "text-navy" : "text-muted"
                    }`}
                  >
                    {c.label} {c.tanggal}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-[10.5px] text-muted">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2 w-2 rounded-sm bg-brand" /> Hari ini
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2 w-2 rounded-sm bg-[#BBD8F1]" /> Hari sebelumnya
            </span>
            <span className="w-full sm:ml-auto sm:w-auto">{db.orders.length} total pesanan tercatat</span>
          </div>
        </section>

        <section className="card flex flex-col p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-[15px] font-extrabold text-navy">Verifikasi pembayaran</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Cocokkan dana masuk sebelum menyiapkan pesanan.
              </p>
            </div>
            <span className="rounded-full bg-[#FFF4E3] px-2.5 py-1 text-[11px] font-extrabold text-[#8A520B]">
              {verifikasi.length}
            </span>
          </div>

          <div className="mt-3 flex-1 space-y-2.5">
            {verifikasi.length === 0 && (
              <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-paper/70 px-4 text-center">
                <ShieldCheck size={24} className="text-leaf" />
                <p className="mt-2 text-[12.5px] font-bold text-navy">Semua pembayaran beres</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Tidak ada pembayaran yang menunggu verifikasi.
                </p>
              </div>
            )}
            {verifikasi.slice(0, 3).map((o) => (
              <div key={o.id} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/pesanan/${o.kode}`}
                      className="truncate text-[12.5px] font-extrabold text-navy hover:text-brand"
                    >
                      {o.kode}
                    </Link>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {o.pelanggan} · {PAYMENT_LABEL[o.pembayaran]}
                    </p>
                  </div>
                  <p className="stat-num flex-none text-[12.5px] font-extrabold text-navy">
                    {rupiah(o.total)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted">{relatif(o.dibuat)}</span>
                  <QuickPaid kode={o.kode} />
                </div>
              </div>
            ))}
          </div>

          {verifikasi.length > 0 && (
            <Link
              href="/admin/pesanan"
              className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-brand hover:text-brand-dark"
            >
              Lihat semua pesanan <ArrowRight size={13} />
            </Link>
          )}
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3.5 md:px-5">
            <h2 className="text-[15px] font-extrabold text-navy">Pesanan terbaru</h2>
            <Link
              href="/admin/pesanan"
              className="inline-flex items-center gap-1 text-[11.5px] font-bold text-brand hover:text-brand-dark"
            >
              Semua pesanan <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {pesanan.slice(0, 5).map((o) => (
              <Link
                key={o.id}
                href={`/admin/pesanan/${o.kode}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper md:px-5"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-mist text-[10px] font-extrabold text-brand">
                  {inisial(o.pelanggan)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-navy">{o.pelanggan}</p>
                  <p className="truncate text-[10.5px] text-muted">
                    {o.kode} · {o.metode === "antar" ? "Antar ke rumah" : "Ambil di toko"} ·{" "}
                    {relatif(o.dibuat)}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="stat-num flex-none text-[12px] font-extrabold text-navy">
                  {rupiah(o.total)}
                </p>
              </Link>
            ))}
            {pesanan.length === 0 && (
              <p className="px-5 py-8 text-center text-[12px] text-muted">
                Belum ada pesanan masuk.
              </p>
            )}
          </div>
        </section>

        <div className="space-y-4">
          <section className="card p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-navy">Stok menipis</h2>
              <Link
                href="/admin/produk"
                className="text-[11.5px] font-bold text-brand hover:text-brand-dark"
              >
                Kelola
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {stokTipis.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg ${
                      p.stok === 0
                        ? "bg-[#FDF2F1] text-[#8F2E25]"
                        : "bg-[#FFF4E3] text-[#8A520B]"
                    }`}
                  >
                    <Package size={13} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-navy">
                    {p.nama}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold ${
                      p.stok === 0 ? "text-[#8F2E25]" : "text-[#8A520B]"
                    }`}
                  >
                    {p.stok === 0 ? "Habis" : `${p.stok} ${p.satuan}`}
                  </span>
                </li>
              ))}
              {stokTipis.length === 0 && (
                <li className="flex items-center gap-2 rounded-xl bg-leaf-soft px-3 py-2.5 text-[11.5px] font-semibold text-leaf">
                  <ShieldCheck size={15} /> Semua stok produk aman.
                </li>
              )}
            </ul>
          </section>

          <section className="card p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-navy">Tim kurir</h2>
              <Link
                href="/admin/pesanan"
                className="text-[11.5px] font-bold text-brand hover:text-brand-dark"
              >
                Tugas
              </Link>
            </div>
            <ul className="mt-3 space-y-2.5">
              {db.couriers.map((c) => (
                <li key={c.id} className="flex items-center gap-2.5">
                  <AvatarPeran peran="kurir" ukuran={32} className="ring-1 ring-line" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-navy">{c.nama}</p>
                    <p className="text-[10px] text-muted">{c.kendaraan}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      c.status === "mengantar"
                        ? "bg-mist text-brand"
                        : c.status === "siap"
                          ? "bg-leaf-soft text-leaf"
                          : "bg-[#EEF2F7] text-muted"
                    }`}
                  >
                    {c.status === "mengantar"
                      ? "Mengantar"
                      : c.status === "siap"
                        ? "Siap"
                        : "Off"}
                  </span>
                </li>
              ))}
            </ul>
            {diantar.length > 0 && (
              <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-mist px-2.5 py-2 text-[10.5px] leading-snug text-brand">
                <CircleAlert size={12} className="mt-0.5 flex-none" />
                {diantar.length} pesanan sedang dalam pengantaran. Pantau di halaman
                pesanan.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

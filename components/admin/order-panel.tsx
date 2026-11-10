"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bike,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { PaymentBadge } from "@/components/payment-badge";
import { OrderStatusBadge } from "@/components/status-badge";
import { rupiah, salinTeks, tanggalJam, teleponRapi, waLink } from "@/lib/format";
import {
  PAYMENT_LABEL,
  type CourierPublic,
  type Delivery,
  type Order,
  type OrderItem,
  type OrderStatus,
  type Settings,
} from "@/lib/types";

const alur: OrderStatus[] = ["baru", "dikonfirmasi", "disiapkan", "siap", "selesai"];

export function AdminOrderPanel({
  order,
  items,
  delivery,
  kurir,
  couriers,
  settings,
}: {
  order: Order;
  items: OrderItem[];
  delivery: Delivery | null;
  kurir: CourierPublic | null;
  couriers: CourierPublic[];
  settings: Settings;
}) {
  const router = useRouter();
  const [proses, setProses] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [tanyaBatal, setTanyaBatal] = useState(false);
  const [kurirPilih, setKurirPilih] = useState(order.kurirId);
  const [tersalin, setTersalin] = useState(false);

  const selesai = order.status === "selesai" || order.status === "batal";

  async function kirim(patch: Record<string, unknown>, aksi: string) {
    setProses(aksi);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.kode)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memperbarui pesanan.");
      setTanyaBatal(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui pesanan.");
    } finally {
      setProses(null);
    }
  }

  async function salin() {
    if (await salinTeks(order.kode)) {
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1600);
    } else {
      setError("Kode tidak bisa disalin otomatis.");
    }
  }

  const aksiUtama: { label: string; status: OrderStatus; icon: typeof Check } | null =    order.status === "baru"
      ? { label: "Konfirmasi pesanan", status: "dikonfirmasi", icon: Check }
      : order.status === "dikonfirmasi"
        ? { label: "Mulai siapkan pesanan", status: "disiapkan", icon: Check }
        : order.status === "disiapkan" && order.metode === "antar"
          ? { label: "Serahkan ke kurir", status: "diantar", icon: Truck }
          : order.status === "disiapkan"
            ? { label: "Tandai siap diambil", status: "siap", icon: Store }
            : order.status === "siap" && order.metode === "antar"
              ? { label: "Serahkan ke kurir", status: "diantar", icon: Truck }
              : order.status === "siap"
                ? { label: "Selesaikan pesanan", status: "selesai", icon: CheckCircle2 }
                : order.status === "diantar"
                  ? { label: "Tandai sudah diterima", status: "selesai", icon: CheckCircle2 }
                  : null;

  const tahap = alur.indexOf(order.status === "diantar" ? "siap" : order.status);

  const infoBayar =
    order.pembayaran === "transfer"
      ? `${settings.rekening} · a.n. ${settings.atasNama}`
      : order.pembayaran === "qris"
        ? `QRIS ${settings.qrisNama}`
        : "Dibayar langsung di toko saat pengambilan.";

  const AksiIcon = aksiUtama?.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[12px] text-muted">
        <Link href="/admin/pesanan" className="hover:text-navy">
          Pesanan
        </Link>
        <ArrowRight size={13} />
        <span className="font-semibold text-navy">{order.kode}</span>
      </div>

      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-extrabold tracking-tight text-navy md:text-[26px]">
                {order.kode}
              </h1>
              <button
                type="button"
                onClick={salin}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2 text-[10.5px] font-bold text-muted hover:border-brand hover:text-brand"
              >
                {tersalin ? <Check size={12} /> : <Copy size={12} />}
                {tersalin ? "Tersalin" : "Salin kode"}
              </button>
            </div>
            <p className="mt-1 text-[12px] text-muted">
              Dibuat {tanggalJam(order.dibuat)} · diperbarui {tanggalJam(order.diperbarui)}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <OrderStatusBadge status={order.status} />
              <PaymentBadge metode={order.pembayaran} dibayar={order.dibayar} lengkap />
              <span className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2 py-0.5 text-[10px] font-bold text-navy">
                {order.metode === "antar" ? <Bike size={11} /> : <Store size={11} />}
                {order.metode === "antar" ? "Antar ke rumah" : "Ambil di toko"}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
            {aksiUtama && (
              <button
                type="button"
                onClick={() => kirim({ status: aksiUtama.status }, "status")}
                disabled={proses !== null}
                className="btn btn-primary w-full sm:w-auto"
              >
                {proses === "status" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  AksiIcon && <AksiIcon size={15} />
                )}
                {aksiUtama.label}
              </button>
            )}
            {order.status === "selesai" && (
              <p className="inline-flex items-center gap-1.5 rounded-xl bg-leaf-soft px-3 py-2 text-[11.5px] font-bold text-leaf">
                <CheckCircle2 size={14} /> Pesanan selesai
              </p>
            )}
            {order.status === "batal" && (
              <p className="inline-flex items-center gap-1.5 rounded-xl bg-[#EEF2F7] px-3 py-2 text-[11.5px] font-bold text-muted">
                <X size={14} /> Pesanan dibatalkan
              </p>
            )}
            <Link
              href={`/pesanan/${order.kode}`}
              className="btn btn-outline btn-sm w-full sm:w-auto"
            >
              Halaman pelanggan <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3 py-2 text-[11.5px] text-[#8F2E25]"
          >
            <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
          </div>
        )}

        {order.status !== "batal" && (
          <ol className="mt-4 flex items-center gap-1 overflow-x-auto pt-1">
            {alur.map((s, i) => {
              const lewat = i <= tahap;
              const sekarang =
                (order.status === "diantar" ? "siap" : order.status) === s;
              return (
                <li key={s} className="flex min-w-0 flex-1 items-center gap-1">
                  <span
                    className={`flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${
                      sekarang
                        ? "bg-navy text-white"
                        : lewat
                          ? "bg-mist text-brand"
                          : "bg-paper text-muted"
                    }`}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full text-[8px] ${
                        lewat ? "bg-brand text-white" : "bg-line text-muted"
                      }`}
                    >
                      {lewat ? "✓" : i + 1}
                    </span>
                    <span className="truncate">
                      {s === "siap"
                        ? order.metode === "antar"
                          ? "Diantar"
                          : "Siap diambil"
                        : s === "selesai"
                          ? "Selesai"
                          : s === "baru"
                            ? "Masuk"
                            : s === "dikonfirmasi"
                              ? "Dikonfirmasi"
                              : "Disiapkan"}
                    </span>
                  </span>
                  {i < alur.length - 1 && <span className="h-px flex-1 bg-line" />}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-4">
          <section className="card p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-mist text-[12px] font-extrabold text-brand">
                {order.pelanggan
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-extrabold text-navy">{order.pelanggan}</h2>
                <p className="text-[11.5px] text-muted">{teleponRapi(order.telepon)}</p>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={`tel:${order.telepon}`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-navy hover:bg-mist"
                  aria-label={`Telepon ${order.pelanggan}`}
                >
                  <Phone size={16} />
                </a>
                <a
                  href={waLink(
                    order.telepon,
                    `Halo ${order.pelanggan}, kami dari Jayanti Frozen mengenai pesanan ${order.kode}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-leaf hover:bg-leaf-soft"
                  aria-label={`WhatsApp ${order.pelanggan}`}
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                  {order.metode === "antar" ? "Alamat pengantaran" : "Pengambilan"}
                </dt>
                <dd className="mt-1 flex items-start gap-1.5 text-[12px] leading-relaxed text-navy">
                  <MapPin size={13} className="mt-0.5 flex-none text-brand" />
                  {order.metode === "antar"
                    ? order.alamat
                    : `${settings.namaToko}, ${settings.alamat}`}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                  Jadwal
                </dt>
                <dd className="mt-1 flex items-start gap-1.5 text-[12px] leading-relaxed text-navy">
                  <UserRound size={13} className="mt-0.5 flex-none text-brand" />
                  {order.jadwal || "Secepatnya"}
                </dd>
              </div>
              {order.catatan && (
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                    Catatan pembeli
                  </dt>
                  <dd className="mt-1 rounded-xl bg-paper px-3 py-2 text-[12px] leading-relaxed text-navy">
                    “{order.catatan}”
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5 md:px-5">
              <h2 className="text-[15px] font-extrabold text-navy">Produk pesanan</h2>
              <span className="text-[11px] font-semibold text-muted">
                {items.reduce((n, i) => n + i.jumlah, 0)} item
              </span>
            </div>
            <ul className="divide-y divide-line">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 px-4 py-3 md:px-5">
                  <Image
                    src={it.gambar}
                    alt={it.nama}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-none rounded-lg border border-line object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">{it.nama}</p>
                    <p className="text-[10.5px] text-muted">
                      {it.jumlah} × {rupiah(it.harga)} / {it.satuan}
                    </p>
                  </div>
                  <p className="stat-num flex-none text-[12.5px] font-extrabold text-navy">
                    {rupiah(it.harga * it.jumlah)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-line bg-paper/60 px-4 py-3.5 text-[12px] md:px-5">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd className="stat-num font-semibold text-navy">{rupiah(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Ongkir</dt>
                <dd className="stat-num font-semibold text-navy">
                  {order.ongkir === 0 ? "Gratis" : rupiah(order.ongkir)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-[14px]">
                <dt className="font-extrabold text-navy">Total</dt>
                <dd className="stat-num font-extrabold text-navy">{rupiah(order.total)}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-4">
          <section className="card p-4 md:p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[15px] font-extrabold text-navy">Pembayaran</h2>
              <PaymentBadge metode={order.pembayaran} dibayar={order.dibayar} />
            </div>
            <p className="mt-2 text-[12px] text-muted">{PAYMENT_LABEL[order.pembayaran]}</p>
            <p className="mt-2 rounded-xl bg-paper px-3 py-2.5 text-[11.5px] leading-relaxed text-navy">
              {infoBayar}
            </p>
            <p className="stat-num mt-3 text-[22px] font-extrabold text-navy">
              {rupiah(order.total)}
            </p>
            <button
              type="button"
              onClick={() => kirim({ dibayar: !order.dibayar }, "bayar")}
              disabled={proses !== null || order.status === "batal"}
              className={`btn mt-3 w-full ${
                order.dibayar ? "btn-outline" : "btn-primary"
              }`}
            >
              {proses === "bayar" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : order.dibayar ? (
                <X size={15} />
              ) : (
                <Check size={15} />
              )}
              {order.dibayar ? "Batalkan status lunas" : "Tandai sudah dibayar"}
            </button>
            <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
              Periksa dana masuk di rekening atau mutasi QRIS sebelum menandai lunas.
            </p>
          </section>

          <section className="card p-4 md:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-extrabold text-navy">Pengantaran</h2>
              {delivery && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    delivery.status === "selesai"
                      ? "bg-leaf-soft text-leaf"
                      : delivery.status === "aktif"
                        ? "bg-mist text-brand"
                        : "bg-[#EEF2F7] text-muted"
                  }`}
                >
                  {delivery.status === "selesai"
                    ? "Selesai"
                    : delivery.status === "aktif"
                      ? "Kurir di jalan"
                      : "Ditugaskan"}
                </span>
              )}
            </div>

            {order.metode === "antar" ? (
              <>
                <label htmlFor="kurir" className="label mt-3">Kurir pengantar</label>
                <select
                  id="kurir"
                  className="field"
                  value={kurirPilih}
                  onChange={(e) => setKurirPilih(e.target.value)}
                  disabled={selesai}
                >
                  <option value="">Belum ditugaskan</option>
                  {couriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama} · {c.kendaraan}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => kirim({ kurirId: kurirPilih }, "kurir")}
                  disabled={
                    proses !== null || selesai || kurirPilih === order.kurirId
                  }
                  className="btn btn-outline mt-2 w-full"
                >
                  {proses === "kurir" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Truck size={15} />
                  )}
                  Simpan penugasan
                </button>

                {kurir && (
                  <div className="mt-3 rounded-xl border border-line bg-paper/70 p-3">
                    <p className="text-[12px] font-bold text-navy">{kurir.nama}</p>
                    <p className="text-[10.5px] text-muted">
                      {teleponRapi(kurir.telepon)} · {kurir.kendaraan}
                    </p>
                    {delivery?.mulai && (
                      <p className="mt-1 text-[10.5px] text-muted">
                        Mulai antar {tanggalJam(delivery.mulai)}
                        {delivery.selesai ? ` · tiba ${tanggalJam(delivery.selesai)}` : ""}
                      </p>
                    )}
                    {delivery?.lat != null && delivery?.lng != null && (
                      <a
                        href={`https://www.google.com/maps?q=${delivery.lat},${delivery.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-brand hover:text-brand-dark"
                      >
                        <MapPin size={11} /> Lihat posisi GPS kurir
                      </a>
                    )}
                  </div>
                )}
                {order.status === "diantar" && (
                  <Link
                    href={`/pesanan/${order.kode}`}
                    className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-brand hover:text-brand-dark"
                  >
                    Pantau pelacakan pelanggan <ArrowRight size={12} />
                  </Link>
                )}
              </>
            ) : (
              <div className="mt-3 rounded-xl bg-paper px-3 py-3">
                <p className="flex items-center gap-1.5 text-[12px] font-bold text-navy">
                  <Store size={14} className="text-brand" /> Diambil di toko
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  {order.jadwal || "Secepatnya"} · {settings.alamat}
                </p>
              </div>
            )}
          </section>

          {!selesai && (
            <section className="rounded-[18px] border border-[#F5CFCB] bg-[#FDF8F7] p-4">
              <h2 className="text-[13px] font-extrabold text-[#8F2E25]">Batalkan pesanan</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-[#8F2E25]/75">
                Stok produk otomatis dikembalikan. Tindakan ini tidak bisa diurungkan.
              </p>
              {tanyaBatal ? (
                <div className="mt-2.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => kirim({ status: "batal" }, "batal")}
                    disabled={proses !== null}
                    className="btn btn-sm flex-1 bg-[#A3352C] text-white hover:bg-[#8c2a22]"
                  >
                    {proses === "batal" ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <X size={13} />
                    )}
                    Ya, batalkan
                  </button>
                  <button
                    type="button"
                    onClick={() => setTanyaBatal(false)}
                    className="btn btn-sm btn-outline flex-1"
                  >
                    Tidak jadi
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setTanyaBatal(true)}
                  className="btn btn-danger btn-sm mt-2.5 w-full"
                >
                  Batalkan pesanan
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

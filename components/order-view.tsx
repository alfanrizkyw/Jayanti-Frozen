"use client";

import { Gambar } from "./gambar";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Bike,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Landmark,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  QrCode,
  Snowflake,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { PetaPengantaran } from "./peta-pengantaran";
import { PilihTitik, type TitikPilihan } from "./pilih-titik";
import { OrderStatusBadge } from "./status-badge";
import { ReceiptActions } from "./receipt-actions";
import { BuktiFoto } from "./bukti-foto";
import { simpanKodePesanan } from "@/lib/order-history";
import {
  inisial,
  relatif,
  rupiah,
  salinTeks,
  tanggalJam,
  teleponRapi,
  waLink,
} from "@/lib/format";
import {
  PAYMENT_LABEL,
  STATUS_LABEL,
  type Delivery,
  type Order,
  type OrderItem,
  type Settings,
} from "@/lib/types";

type KurirInfo = {
  id: string;
  nama: string;
  kendaraan: string;
  rating: number;
  telepon: string;
} | null;

export interface OrderViewData {
  order: Order;
  items: OrderItem[];
  delivery: Delivery | null;
  kurir: KurirInfo;
  settings: Settings;
}

const urutanStatus: Record<string, number> = {
  baru: 0,
  dikonfirmasi: 1,
  disiapkan: 2,
  siap: 3,
  diantar: 3,
  selesai: 4,
};

export function OrderView({
  initial,
  baru,
}: {
  initial: OrderViewData;
  baru: boolean;
}) {
  const [data, setData] = useState<OrderViewData>(initial);
  const [sekarang, setSekarang] = useState<number | null>(null);
  const [salin, setSalin] = useState("");
  const [ubahTitik, setUbahTitik] = useState(false);
  const [drafTitik, setDrafTitik] = useState<TitikPilihan | null>(null);
  const [menyimpanTitik, setMenyimpanTitik] = useState(false);
  const [pesanTitik, setPesanTitik] = useState("");
  const [gagalTitik, setGagalTitik] = useState(false);

  const { order, items, delivery, kurir, settings } = data;
  const final = order.status === "selesai" || order.status === "batal";

  useEffect(() => {
    simpanKodePesanan(order.kode);
  }, [order.kode]);

  useEffect(() => {
    setSekarang(Date.now());
    const jam = setInterval(() => setSekarang(Date.now()), 10_000);
    return () => clearInterval(jam);
  }, []);

  useEffect(() => {
    if (final) return;
    let berhenti = false;
    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(order.kode)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (berhenti) return;
        setData((prev) =>
          prev.order.diperbarui === json.order.diperbarui &&
          prev.delivery?.diperbarui === json.delivery?.diperbarui
            ? prev
            : {
                ...prev,
                order: json.order,
                items: json.items,
                delivery: json.delivery,
                kurir: json.kurir,
              },
        );
      } catch {
        /* coba lagi pada polling berikutnya */
      }
    };
    const timer = setInterval(tick, 4000);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      berhenti = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, [order.kode, final]);

  const jumlah = items.reduce((a, b) => a + b.jumlah, 0);
  const rekeningTampil = settings.bank?.length
    ? settings.bank
    : settings.rekening
      ? [{ bank: "", nomor: settings.rekening, atasNama: settings.atasNama }]
      : [];

  const eta = useMemo(() => {
    if (order.status === "selesai") return 0;
    if (order.status !== "diantar" || !delivery?.mulai)
      return delivery?.estimasiMenit ?? settings.estimasiAntar;
    const estimasi = (delivery.estimasiMenit || settings.estimasiAntar) * 60_000;
    const lewat = (sekarang ?? Date.now()) - new Date(delivery.mulai).getTime();
    return Math.max(1, Math.ceil((estimasi - lewat) / 60_000));
  }, [order.status, delivery, settings.estimasiAntar, sekarang]);

  const gpsAktif = Boolean(delivery?.lat && delivery?.lng);
  const titikPelanggan =
    order.lat != null && order.lng != null
      ? { lat: order.lat, lng: order.lng }
      : null;
  const bisaUbahTitik =
    order.metode === "antar" &&
    order.status !== "selesai" &&
    order.status !== "batal";

  const langkah = [
    { k: "baru", label: "Pesanan diterima", desc: "Pesanan masuk dan menunggu konfirmasi admin." },
    { k: "dikonfirmasi", label: "Dikonfirmasi", desc: "Pembayaran dan pesanan sudah diverifikasi." },
    { k: "disiapkan", label: "Sedang disiapkan", desc: "Produk diambil dari freezer dan dikemas." },
    {
      k: order.metode === "antar" ? "diantar" : "siap",
      label: order.metode === "antar" ? "Diantar kurir" : "Siap diambil",
      desc:
        order.metode === "antar"
          ? "Kurir membawa pesanan menuju alamat Anda."
          : `Ambil di ${settings.alamat}.`,
    },
    {
      k: "selesai",
      label: "Selesai",
      desc:
        order.metode === "antar"
          ? "Pesanan sudah diterima. Terima kasih!"
          : "Pesanan sudah diambil. Terima kasih!",
    },
  ];
  const aktifIndex = urutanStatus[order.status] ?? -1;

  async function copy(text: string, label: string) {
    if (await salinTeks(text)) {
      setSalin(label);
      setTimeout(() => setSalin(""), 1800);
    }
  }

  async function simpanTitik() {
    if (!drafTitik) return;
    setMenyimpanTitik(true);
    setPesanTitik("");
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(order.kode)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: drafTitik.lat, lng: drafTitik.lng }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Titik gagal disimpan.");
      if (json?.order) setData((prev) => ({ ...prev, order: json.order }));
      setUbahTitik(false);
      setDrafTitik(null);
      setGagalTitik(false);
      setPesanTitik("Titik lokasi tersimpan. Kurir menuju titik ini.");
    } catch (err) {
      setGagalTitik(true);
      setPesanTitik(
        err instanceof Error ? err.message : "Titik gagal disimpan.",
      );
    } finally {
      setMenyimpanTitik(false);
    }
  }

  return (
    <div className="container-page pt-5 md:pt-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-muted">
        <Link href="/" className="hover:text-navy">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/lacak" className="hover:text-navy">Riwayat pesanan</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-navy">{order.kode}</span>
      </nav>

      {baru && (
        <div className="rise mt-4 flex items-start gap-3 rounded-[16px] border border-[#C6E7DA] bg-leaf-soft px-4 py-3.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-leaf">
            <CheckCircle2 size={19} />
          </span>
          <div>
            <p className="text-[13.5px] font-extrabold text-[#12563F]">
              Pesanan berhasil dibuat
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#1F7A5C]/85">
              Simpan kode <strong className="font-bold">{order.kode}</strong> untuk
              melacak. Admin akan mengonfirmasi lewat nomor WhatsApp Anda.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Status pesanan</p>
          <h1 className="mt-1 flex flex-wrap items-center gap-2.5 text-[25px] font-extrabold text-navy md:text-[30px]">
            {order.kode}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Dibuat {tanggalJam(order.dibuat)} · atas nama {order.pelanggan}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copy(order.kode, "kode")}
            className="btn btn-outline btn-sm"
          >
            {salin === "kode" ? <Check size={14} /> : <Copy size={14} />}
            {salin === "kode" ? "Tersalin" : "Salin kode"}
          </button>
          {order.status !== "batal" && (
            <ReceiptActions order={order} items={items} settings={settings} />
          )}
          <a
            href={waLink(
              settings.telepon,
              `Halo Yanti Frozen, saya mau menanyakan pesanan ${order.kode}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <MessageCircle size={14} /> Hubungi toko
          </a>
        </div>
      </div>

      {order.status === "batal" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-4 py-3 text-[12.5px] text-[#8F2E25]">
          <AlertCircle size={16} className="mt-0.5 flex-none" />
          Pesanan ini dibatalkan. Hubungi toko bila Anda sudah melakukan
          pembayaran.
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <div className="space-y-4">
          {order.status !== "batal" && (
            <section className="overflow-hidden rounded-[18px] border border-line bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 md:px-5">
                <div className="flex items-center gap-2">
                  {order.metode === "antar" ? (
                    <Truck size={17} className="text-brand" />
                  ) : (
                    <Store size={17} className="text-brand" />
                  )}
                  <h2 className="text-[14px] font-extrabold text-navy">
                    {order.metode === "antar" ? "Pelacakan kurir" : "Pengambilan di toko"}
                  </h2>
                </div>
                {order.status === "diantar" && (
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-leaf">
                    <span className="live-dot h-1.5 w-1.5 rounded-full bg-leaf" />
                    LIVE
                  </span>
                )}
              </div>

              <div className="p-4 md:p-5">
                {order.metode === "antar" ? (
                  <>
                    {titikPelanggan ||
                    order.status === "diantar" ||
                    order.status === "selesai" ? (
                      <>
                        <PetaPengantaran
                          tujuan={titikPelanggan}
                          posisi={
                            delivery?.lat != null && delivery?.lng != null
                              ? { lat: delivery.lat, lng: delivery.lng }
                              : null
                          }
                          aktif={order.status === "diantar"}
                          etaMenit={order.status === "diantar" ? eta : null}
                          labelTujuan="Titik Anda"
                        />
                        {order.status !== "diantar" &&
                          order.status !== "selesai" && (
                            <p className="mt-2 text-[11px] leading-relaxed text-muted">
                              {kurir
                                ? `${kurir.nama} berangkat setelah pesanan diserahkan admin.`
                                : "Admin menentukan kurir saat pesanan siap. Peta kurir aktif saat pengantaran mulai."}
                            </p>
                          )}
                      </>
                    ) : (
                      <div className="flex items-start gap-3 rounded-xl bg-paper p-4">
                        <Truck size={19} className="mt-0.5 flex-none text-brand" />
                        <div>
                          <p className="text-[13px] font-bold text-navy">
                            {kurir
                              ? "Pesanan disiapkan, kurir segera berangkat"
                              : "Kurir belum ditugaskan"}
                          </p>
                          <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                            {kurir
                              ? `${kurir.nama} berangkat setelah admin menyerahkan pesanan. Peta muncul otomatis di sini.`
                              : "Admin menentukan kurir saat pesanan siap. Peta muncul di sini."}
                          </p>
                        </div>
                      </div>
                    )}

                    {kurir && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
                        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">
                          {inisial(kurir.nama)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-navy">
                            {kurir.nama}
                            <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-[#8A520B]">
                              <Star size={11} fill="currentColor" /> {kurir.rating}
                            </span>
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted">
                            <Bike size={11} /> {kurir.kendaraan}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {gpsAktif
                              ? `Lokasi GPS aktif · ${relatif(delivery?.diperbarui ?? "")}`
                              : "Lokasi diperbarui otomatis saat kurir berangkat"}
                          </p>
                        </div>
                        <a
                          href={waLink(
                            kurir.telepon,
                            `Halo ${kurir.nama}, saya penerima pesanan ${order.kode}.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <Phone size={13} /> Hubungi
                        </a>
                      </div>
                    )}

                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-mist px-3 py-2.5">
                      <MapPin size={14} className="mt-0.5 flex-none text-brand" />
                      <p className="text-[11.5px] leading-relaxed text-navy/80">
                        {order.alamat}
                      </p>
                    </div>

                    {bisaUbahTitik && (
                      <div className="mt-3 rounded-xl border border-line bg-white p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                            <MapPin size={12} className="text-brand" /> Titik
                            lokasi antar
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setUbahTitik((lama) => !lama);
                              setDrafTitik(null);
                              setPesanTitik("");
                              setGagalTitik(false);
                            }}
                            className="btn btn-sm btn-outline min-h-11"
                          >
                            {ubahTitik
                              ? "Tutup"
                              : titikPelanggan
                                ? "Ubah titik"
                                : "Tentukan titik"}
                          </button>
                        </div>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                          {titikPelanggan
                            ? "Kurir menuju titik yang Anda tandai di peta, bukan perkiraan dari alamat."
                            : "Titik belum diatur. Tandai titik rumah Anda supaya kurir tidak salah alamat."}
                        </p>

                        {ubahTitik && (
                          <>
                            <PilihTitik
                              alamat={order.alamat}
                              nilai={drafTitik ?? titikPelanggan}
                              onPilih={setDrafTitik}
                            />
                            <button
                              type="button"
                              onClick={simpanTitik}
                              disabled={!drafTitik || menyimpanTitik}
                              className="btn btn-primary mt-2 w-full"
                            >
                              {menyimpanTitik ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Check size={16} />
                              )}
                              {menyimpanTitik ? "Menyimpan…" : "Simpan titik"}
                            </button>
                          </>
                        )}

                        {pesanTitik && (
                          <p
                            role="status"
                            className={`mt-2 text-[11px] font-semibold ${
                              gagalTitik ? "text-[#8F2E25]" : "text-leaf"
                            }`}
                          >
                            {pesanTitik}
                          </p>
                        )}
                      </div>
                    )}

                    {order.status === "selesai" && (
                      <div className="mt-3">
                        <BuktiFoto
                          orderId={order.id}
                          judul="Foto bukti saat pesanan diterima"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 rounded-xl bg-mist px-3.5 py-3">
                      <Snowflake size={17} className="flex-none text-brand" />
                      <p className="text-[12px] leading-relaxed text-navy/80">
                        Tunjukkan kode <strong className="font-bold">{order.kode}</strong>{" "}
                        ke kasir. Pesanan disimpan di freezer sampai Anda ambil.
                      </p>
                    </div>
                    <dl className="mt-3 space-y-2.5 text-[12.5px]">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 flex-none text-brand" />
                        <div>
                          <dt className="font-semibold text-navy">Lokasi ambil</dt>
                          <dd className="text-muted">
                            {settings.alamat}
                            {settings.mapsUrl && (
                              <a
                                href={settings.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline"
                              >
                                <MapPin size={11} /> Buka di Google Maps
                              </a>
                            )}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock size={14} className="mt-0.5 flex-none text-brand" />
                        <div>
                          <dt className="font-semibold text-navy">Jadwal Anda</dt>
                          <dd className="text-muted">{order.jadwal}</dd>
                        </div>
                      </div>
                    </dl>
                  </>
                )}
              </div>
            </section>
          )}

          <section className="rounded-[18px] border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5 md:px-5">
              <h2 className="flex items-center gap-2 text-[14px] font-extrabold text-navy">
                <Package size={16} className="text-brand" />
                Rincian pesanan
              </h2>
              <span className="text-[11.5px] text-muted">{jumlah} produk</span>
            </div>
            <ul className="divide-y divide-line px-4 md:px-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3.5">
                  <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg border border-line bg-mist">
                    <Gambar src={item.gambar} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-bold leading-snug text-navy">
                      {item.nama}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-muted">
                      {item.jumlah} × {rupiah(item.harga)} · {item.satuan}
                    </p>
                  </div>
                  <span className="stat-num text-[12.5px] font-bold text-navy">
                    {rupiah(item.harga * item.jumlah)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-line px-4 py-3.5 text-[12.5px] md:px-5">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="stat-num font-semibold text-navy">{rupiah(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">
                  Ongkir ({order.metode === "antar" ? "antar kurir" : "ambil sendiri"})
                </dt>
                <dd className="stat-num font-semibold text-navy">
                  {order.ongkir === 0 ? <span className="text-leaf">Gratis</span> : rupiah(order.ongkir)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                <dt className="text-[13px] font-extrabold text-navy">Total</dt>
                <dd className="stat-num text-[18px] font-extrabold text-navy">
                  {rupiah(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
            <h2 className="text-[14px] font-extrabold text-navy">Info pesanan</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { icon: order.metode === "antar" ? Truck : Store, k: "Cara terima", v: order.metode === "antar" ? "Antar ke rumah" : "Ambil di toko" },
                { icon: Clock, k: "Jadwal", v: order.jadwal },
                { icon: Phone, k: "Nomor HP", v: teleponRapi(order.telepon) },
                { icon: MapPin, k: "Alamat", v: order.alamat || "—" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex items-start gap-2.5">
                  <Icon size={15} className="mt-0.5 flex-none text-brand" />
                  <div>
                    <dt className="text-[11px] font-semibold text-muted">{k}</dt>
                    <dd className="mt-0.5 text-[12.5px] font-semibold leading-relaxed text-navy">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {order.catatan && (
              <div className="mt-3 rounded-xl bg-paper px-3.5 py-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Catatan</p>
                <p className="mt-1 text-[12px] leading-relaxed text-navy/80">{order.catatan}</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-[118px]">
          <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
            <h2 className="text-[14px] font-extrabold text-navy">Perjalanan pesanan</h2>
            <ol className="mt-4">
              {langkah.map((l, i) => {
                const selesai = aktifIndex > i || order.status === "selesai";
                const sedang = aktifIndex === i && order.status !== "selesai";
                return (
                  <li key={l.k} className="relative flex gap-3 pb-5 last:pb-0">
                    {i < langkah.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-[13px] top-7 h-[calc(100%-16px)] w-px ${
                          selesai ? "bg-brand" : "bg-line"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 flex-none items-center justify-center rounded-full border text-[10px] font-bold ${
                        selesai
                          ? "border-brand bg-brand text-white"
                          : sedang
                            ? "border-brand bg-white text-brand"
                            : "border-line bg-white text-muted"
                      }`}
                    >
                      {selesai ? (
                        <Check size={13} strokeWidth={3} />
                      ) : sedang ? (
                        <span className="h-2 w-2 rounded-full bg-brand" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="pt-0.5">
                      <p
                        className={`text-[12.5px] font-bold ${
                          selesai || sedang ? "text-navy" : "text-muted"
                        }`}
                      >
                        {l.label}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                        {l.desc}
                      </p>
                      {sedang && (
                        <p className="mt-1 inline-flex rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold text-brand">
                          Status sekarang
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-extrabold text-navy">Pembayaran</h2>
              <span
                className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${
                  order.dibayar
                    ? "border-[#C6E7DA] bg-leaf-soft text-leaf"
                    : "border-[#F3DFBC] bg-[#FFF4E3] text-[#8A520B]"
                }`}
              >
                {order.dibayar
                  ? "Lunas"
                  : order.pembayaran === "tunai"
                    ? "Bayar di toko"
                    : "Menunggu konfirmasi"}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-paper px-3 py-2.5">
              {order.pembayaran === "tunai" ? (
                <Banknote size={16} className="text-brand" />
              ) : order.pembayaran === "qris" ? (
                <QrCode size={16} className="text-brand" />
              ) : (
                <Landmark size={16} className="text-brand" />
              )}
              <span className="text-[12px] font-semibold text-navy">
                {PAYMENT_LABEL[order.pembayaran]}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                Total tagihan
              </p>
              <p className="stat-num text-[23px] font-extrabold text-navy">
                {rupiah(order.total)}
              </p>
            </div>

            {order.dibayar ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-leaf-soft px-3 py-2.5 text-[11.5px] leading-relaxed text-leaf">
                <CheckCircle2 size={14} className="mt-0.5 flex-none" />
                Pembayaran sudah dikonfirmasi admin. Terima kasih.
              </p>
            ) : order.pembayaran === "transfer" ? (
              <div className="mt-3 space-y-2">
                {rekeningTampil.map((rek, i) => (
                  <div
                    key={`${rek.bank}-${rek.nomor}-${i}`}
                    className="rounded-xl border border-[#C9E1F7] bg-mist px-3.5 py-3 text-[12px] text-navy/80"
                  >
                    <p className="font-bold text-navy">
                      {rek.bank ? `${rek.bank} · ` : ""}
                      {rek.nomor}
                    </p>
                    <p>a.n. {rek.atasNama}</p>
                    <button
                      type="button"
                      onClick={() =>
                        copy(
                          `${rek.bank ? `${rek.bank} ` : ""}${rek.nomor} a.n. ${rek.atasNama}`,
                          `rekening-${i}`,
                        )
                      }
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand"
                    >
                      {salin === `rekening-${i}` ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      {salin === `rekening-${i}` ? "Tersalin" : "Salin rekening"}
                    </button>
                  </div>
                ))}
                <p className="text-[10.5px] leading-relaxed text-muted">
                  Cantumkan kode {order.kode} di berita transfer.
                </p>
              </div>
            ) : order.pembayaran === "qris" ? (
              <div className="mt-3 rounded-xl border border-line bg-white px-3 py-3.5 text-center">
                {settings.qrisGambar ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.qrisGambar}
                      alt={`Kode QRIS ${settings.qrisNama}`}
                      className="mx-auto h-auto w-[220px] max-w-full rounded-lg bg-white object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                    <p className="mt-2 text-[12.5px] font-extrabold text-navy">
                      {settings.qrisNama} · {rupiah(order.total)}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                      Scan dengan aplikasi bank atau e-wallet. Admin menandai
                      lunas setelah pembayaran masuk.
                    </p>
                  </>
                ) : (
                  <p className="flex items-start gap-2 text-left text-[11.5px] leading-relaxed text-muted">
                    <QrCode size={14} className="mt-0.5 flex-none text-brand" />
                    Gambar QRIS belum diatur toko. Bayar tunai di kasir atau
                    hubungi admin lewat WhatsApp.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-paper px-3 py-2.5 text-[11.5px] leading-relaxed text-muted">
                <Banknote size={14} className="mt-0.5 flex-none text-brand" />
                {order.metode === "antar"
                  ? "Pesanan antar wajib non-tunai. Hubungi toko untuk mengubah metode pembayaran."
                  : "Bayar tunai di kasir saat mengambil pesanan."}
              </p>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-muted">
              <CreditCard size={12} /> Diverifikasi manual oleh admin toko
            </p>
          </section>

          <section className="rounded-[18px] border border-line bg-navy p-4 text-white">
            <p className="text-[13px] font-extrabold">Butuh bantuan?</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-white/65">
              Admin siap membantu setiap hari {settings.jamBuka}.
            </p>
            <div className="mt-3 flex gap-2">
              <a
                href={waLink(settings.telepon, `Halo, soal pesanan ${order.kode}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm flex-1 bg-white text-navy hover:bg-white/90"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <Link
                href="/lacak"
                className="btn btn-sm flex-1 border border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Riwayat pesanan <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <p className="mt-5 text-center text-[11px] text-muted">
        Status terakhir diperbarui {tanggalJam(order.diperbarui)} ·{" "}
        {STATUS_LABEL[order.status]}
      </p>
    </div>
  );
}

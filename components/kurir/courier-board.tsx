"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Banknote,
  Bike,
  Camera,
  CheckCircle2,
  Clock3,
  Copy,
  History,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  Phone,
  Radio,
  RefreshCw,
  X,
} from "lucide-react";
import { TrackMap } from "@/components/track-map";
import {
  jam,
  rupiah,
  salinTeks,
  tanggalJam,
  tanggalPanjang,
  teleponRapi,
  waLink,
} from "@/lib/format";
import type {
  Delivery,
  Order,
  OrderItem,
  Settings,
} from "@/lib/types";
import { PaymentBadge } from "@/components/payment-badge";

type GeoState = "idle" | "mencari" | "aktif" | "ditolak" | "gagal";

export function CourierBoard({
  orders,
  riwayat,
  items,
  deliveries,
  settings,
}: {
  orders: Order[];
  riwayat: Order[];
  items: OrderItem[];
  deliveries: Delivery[];
  settings: Settings;
}) {
  const router = useRouter();
  const [proses, setProses] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [tersalin, setTersalin] = useState("");
  const [geo, setGeo] = useState<GeoState>("idle");
  const [posisi, setPosisi] = useState<{ lat: number; lng: number; at: number } | null>(
    null,
  );
  const [foto, setFoto] = useState<string | null>(null);
  const [unggah, setUnggah] = useState<"idle" | "proses" | "siap" | "gagal">("idle");
  const [pesanFoto, setPesanFoto] = useState("");
  const [pilihKode, setPilihKode] = useState("");
  const inputFoto = useRef<HTMLInputElement | null>(null);
  const watch = useRef<number | null>(null);
  const kirimTerakhir = useRef(0);
  const kodeAktif = useRef("");

  // Semua pesanan di sini sudah diserahkan admin, jadi langsung jadi tugas.
  const aktif =
    orders.find((o) => o.kode === pilihKode) ?? orders[0] ?? null;
  const tugasLain = orders.filter((o) => o.id !== aktif?.id);

  function hentikanLacak() {
    if (watch.current !== null) {
      navigator.geolocation.clearWatch(watch.current);
      watch.current = null;
    }
    setGeo("idle");
  }

  useEffect(() => {
    // Tugas yang diserahkan admin harus langsung terlihat di halaman kurir.
    const muat = () => {
      if (document.visibilityState === "visible" && proses === null) router.refresh();
    };
    const timer = window.setInterval(muat, 5000);
    document.addEventListener("visibilitychange", muat);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", muat);
      if (watch.current !== null) navigator.geolocation.clearWatch(watch.current);
    };
  }, [router, proses]);

  const idAktif = aktif?.id;
  useEffect(() => {
    setFoto((lama) => {
      if (lama) URL.revokeObjectURL(lama);
      return null;
    });
    setUnggah("idle");
    setPesanFoto("");
  }, [idAktif]);

  async function pilihFoto(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPesanFoto("Pilih file foto (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPesanFoto("Ukuran foto maksimal 10 MB.");
      return;
    }
    if (!aktif) return;

    setFoto((lama) => {
      if (lama) URL.revokeObjectURL(lama);
      return URL.createObjectURL(file);
    });
    setUnggah("proses");
    setPesanFoto("Mengunggah foto bukti…");

    const form = new FormData();
    form.append("file", file);
    form.append("kode", aktif.kode);
    try {
      const res = await fetch("/api/kurir/bukti", { method: "POST", body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Foto gagal diunggah.");
      setUnggah("siap");
      setPesanFoto("Foto bukti tersimpan. Pesanan siap ditandai diterima.");
    } catch (err) {
      setUnggah("gagal");
      setPesanFoto(err instanceof Error ? err.message : "Foto gagal diunggah.");
    }
  }

  function mulaiLacak(kode: string) {
    kodeAktif.current = kode;
    if (!("geolocation" in navigator)) {
      setGeo("gagal");
      return;
    }
    if (watch.current !== null) return;
    setGeo("mencari");
    watch.current = navigator.geolocation.watchPosition(
      (p) => {
        const at = Date.now();
        setPosisi({ lat: p.coords.latitude, lng: p.coords.longitude, at });
        setGeo("aktif");
        if (at - kirimTerakhir.current > 8000) {
          kirimTerakhir.current = at;
          fetch("/api/kurir/lokasi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: p.coords.latitude,
              lng: p.coords.longitude,
              kode: kodeAktif.current,
            }),
          }).catch(() => {});
        }
      },
      (err) => {
        setGeo(err.code === 1 ? "ditolak" : "gagal");
        if (watch.current !== null) {
          navigator.geolocation.clearWatch(watch.current);
          watch.current = null;
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );
  }

  async function aksiTugas(order: Order) {
    if (unggah !== "siap") {
      setError("Ambil dan unggah foto bukti barang diterima dulu.");
      return;
    }
    setProses(`${order.kode}-selesai`);
    setError("");
    try {
      const res = await fetch("/api/kurir/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi: "selesai", kode: order.kode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memperbarui tugas.");
      hentikanLacak();
      setPilihKode("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui tugas.");
    } finally {
      setProses(null);
    }
  }

  async function salin(alamat: string) {
    if (await salinTeks(alamat)) {
      setTersalin(alamat);
      setTimeout(() => setTersalin(""), 1600);
    } else {
      setError("Alamat tidak bisa disalin. Silakan salin manual.");
    }
  }

  function itemPesanan(orderId: string) {
    return items.filter((i) => i.orderId === orderId);
  }

  function pengantaran(orderId: string) {
    return deliveries.find((d) => d.orderId === orderId) ?? null;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Halaman kurir</p>
        <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[30px]">
          Tugas antar hari ini
        </h1>
        <p className="mt-1 text-[12.5px] text-muted">
          {tanggalPanjang()} · {orders.length} pesanan untuk diantar
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3.5 py-2.5 text-[11.5px] text-[#8F2E25]"
        >
          <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
        </div>
      )}

      {aktif && (
        <section className="overflow-hidden rounded-[18px] border border-brand/25 bg-white shadow-lift">
          <div className="flex flex-wrap items-center gap-2 bg-navy px-4 py-3 text-white">
            <span className="live-dot h-2 w-2 rounded-full bg-[#7EE0BC]" />
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-sky">
              Sedang diantar
            </p>
            <p className="ml-auto text-[12px] font-bold">{aktif.kode}</p>
          </div>

          <div className="space-y-3.5 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-mist text-[12px] font-extrabold text-brand">
                {aktif.pelanggan
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold text-navy">{aktif.pelanggan}</p>
                <p className="text-[11.5px] text-muted">{teleponRapi(aktif.telepon)}</p>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={`tel:${aktif.telepon}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-navy hover:bg-mist"
                  aria-label={`Telepon ${aktif.pelanggan}`}
                >
                  <Phone size={17} />
                </a>
                <a
                  href={waLink(
                    aktif.telepon,
                    `Halo ${aktif.pelanggan}, saya kurir Jayanti Frozen, pesanan ${aktif.kode} sedang saya antar.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-leaf hover:bg-leaf-soft"
                  aria-label={`WhatsApp ${aktif.pelanggan}`}
                >
                  <MessageCircle size={17} />
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-paper/60 p-3">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">
                Alamat pengantaran
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-[13px] font-semibold leading-relaxed text-navy">
                <MapPin size={15} className="mt-0.5 flex-none text-brand" />
                {aktif.alamat}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    aktif.alamat,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-navy"
                >
                  <Navigation size={14} /> Buka navigasi
                </a>
                <button
                  type="button"
                  onClick={() => salin(aktif.alamat)}
                  className="btn btn-sm btn-outline"
                >
                  {tersalin === aktif.alamat ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {tersalin === aktif.alamat ? "Tersalin" : "Salin alamat"}
                </button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-line px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  <Banknote size={12} /> Pembayaran
                </p>
                <div className="mt-1.5">
                  <PaymentBadge
                    metode={aktif.pembayaran}
                    dibayar={aktif.dibayar}
                    lengkap
                  />
                </div>
                <p className="mt-1.5 text-[13px] font-extrabold text-navy">
                  {aktif.pembayaran === "tunai" && !aktif.dibayar
                    ? `Tagih tunai ${rupiah(aktif.total)}`
                    : rupiah(aktif.total)}
                </p>
              </div>
              <div className="rounded-xl border border-line px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  <Clock3 size={12} /> Mulai antar
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-navy">
                  {pengantaran(aktif.id)?.mulai
                    ? jam(pengantaran(aktif.id)!.mulai)
                    : "—"}
                </p>
                <p className="mt-0.5 text-[10px] text-muted">
                  Estimasi {pengantaran(aktif.id)?.estimasiMenit ?? settings.estimasiAntar} menit
                </p>
              </div>
            </div>

            <TrackMap
              progress={(() => {
                const d = pengantaran(aktif.id);
                if (!d?.mulai) return 0.05;
                const menit =
                  (Date.now() - new Date(d.mulai).getTime()) / 60000;
                return Math.min(0.95, Math.max(0.05, menit / (d.estimasiMenit || 20)));
              })()}
              aktif
              etaMenit={(() => {
                const d = pengantaran(aktif.id);
                if (!d?.mulai) return d?.estimasiMenit ?? settings.estimasiAntar;
                const menit = (Date.now() - new Date(d.mulai).getTime()) / 60000;
                return Math.max(0, Math.ceil((d.estimasiMenit || 20) - menit));
              })()}
              gpsAktif={geo === "aktif"}
              labelTujuan="Alamat pelanggan"
            />

            <div className="rounded-xl border border-line bg-white px-3 py-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                <PackageCheck size={12} /> Isi pesanan ·{" "}
                {itemPesanan(aktif.id).reduce((n, i) => n + i.jumlah, 0)} item
              </p>
              <ul className="mt-1.5 space-y-1">
                {itemPesanan(aktif.id).map((i) => (
                  <li
                    key={i.id}
                    className="flex items-baseline justify-between gap-2 text-[12px] text-navy"
                  >
                    <span className="min-w-0 truncate">{i.nama}</span>
                    <span className="flex-none font-bold">{i.jumlah}×</span>
                  </li>
                ))}
              </ul>
              {aktif.catatan && (
                <p className="mt-2 rounded-lg bg-[#FFF4E3] px-2.5 py-2 text-[11px] leading-relaxed text-[#8A520B]">
                  Catatan pembeli: “{aktif.catatan}”
                </p>
              )}
            </div>

            <GpsPanel
              state={geo}
              posisi={posisi}
              onMulai={() => mulaiLacak(aktif.kode)}
              onStop={hentikanLacak}
            />

            <div
              className={`rounded-xl border p-3 ${
                unggah === "siap"
                  ? "border-[#C6E7DA] bg-leaf-soft"
                  : "border-[#F3DFBC] bg-[#FFF9EF]"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                    <Camera size={12} /> Foto bukti diterima · wajib
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Foto barang yang diserahkan ke pelanggan. Pesanan tidak bisa
                    ditandai selesai tanpa foto ini.
                  </p>
                </div>
                {unggah === "siap" && (
                  <CheckCircle2 size={18} className="flex-none text-leaf" />
                )}
              </div>

              {foto && (
                <div className="mt-2 overflow-hidden rounded-lg border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto}
                    alt="Pratinjau foto bukti pengantaran"
                    className="h-auto max-h-[240px] w-full object-cover"
                  />
                </div>
              )}

              {pesanFoto && (
                <p
                  role="status"
                  className={`mt-1.5 text-[11px] font-semibold ${
                    unggah === "gagal"
                      ? "text-[#8F2E25]"
                      : unggah === "siap"
                        ? "text-leaf"
                        : "text-muted"
                  }`}
                >
                  {pesanFoto}
                </p>
              )}

              <input
                ref={inputFoto}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                aria-label="Pilih foto bukti pengantaran"
                onChange={(e) => {
                  void pilihFoto(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => inputFoto.current?.click()}
                disabled={unggah === "proses"}
                className="btn btn-outline mt-2 w-full"
              >
                {unggah === "proses" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Camera size={15} />
                )}
                {unggah === "siap"
                  ? "Ganti foto bukti"
                  : unggah === "proses"
                    ? "Mengunggah…"
                    : "Ambil / pilih foto bukti"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => aksiTugas(aktif)}
              disabled={proses !== null || unggah !== "siap"}
              className="btn btn-primary btn-lg w-full"
            >
              {proses === `${aktif.kode}-selesai` ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <CheckCircle2 size={17} />
              )}
              Pesanan sudah diantar
            </button>
            {unggah !== "siap" && (
              <p className="text-center text-[10.5px] text-muted">
                Ambil foto bukti dulu untuk mengaktifkan tombol ini.
              </p>
            )}
          </div>
        </section>
      )}

      {tugasLain.length > 0 && (
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3.5">
            <h2 className="flex items-center gap-2 text-[14px] font-extrabold text-navy">
              <Bike size={15} className="text-brand" /> Tugas aktif lain
            </h2>
            <span className="text-[11px] font-semibold text-muted">
              {tugasLain.length} pesanan
            </span>
          </div>
          <ul className="divide-y divide-line">
            {tugasLain.map((o) => (
              <li key={o.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-mist text-[11px] font-extrabold text-brand">
                  {o.pelanggan
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-navy">
                    {o.pelanggan}
                  </p>
                  <p className="truncate text-[10.5px] text-muted">
                    {o.kode} · {o.alamat || "Alamat belum diisi"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    hentikanLacak();
                    setPilihKode(o.kode);
                  }}
                  className="btn btn-sm btn-outline flex-none"
                >
                  Buka
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!aktif && (
        <section className="card flex flex-col items-center px-5 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-brand">
            <Bike size={26} />
          </span>
          <p className="mt-3 text-[15px] font-extrabold text-navy">Belum ada tugas antar</p>
          <p className="mt-1 max-w-[380px] text-[12px] leading-relaxed text-muted">
            Pesanan muncul otomatis begitu admin menyerahkannya ke kurir. Tidak
            perlu konfirmasi, cukup antar lalu unggah foto bukti.
          </p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="btn btn-outline btn-sm mt-4"
          >
            <RefreshCw size={14} /> Muat ulang tugas
          </button>
        </section>
      )}

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
          <History size={15} className="text-brand" />
          <h2 className="text-[14px] font-extrabold text-navy">Riwayat pengantaran</h2>
        </div>
        <ul className="divide-y divide-line">
          {riwayat.map((o) => (
            <li key={o.id} className="flex items-center gap-3 px-4 py-2.5">
              <CheckCircle2 size={15} className="flex-none text-leaf" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-navy">
                  {o.pelanggan}
                </p>
                <p className="text-[10px] text-muted">
                  {o.kode} · {tanggalJam(o.diperbarui)}
                </p>
              </div>
              <p className="stat-num flex-none text-[11.5px] font-extrabold text-navy">
                {rupiah(o.total)}
              </p>
            </li>
          ))}
          {riwayat.length === 0 && (
            <li className="px-4 py-6 text-center text-[11.5px] text-muted">
              Belum ada pengantaran yang selesai.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

function GpsPanel({
  state,
  posisi,
  onMulai,
  onStop,
}: {
  state: GeoState;
  posisi: { lat: number; lng: number; at: number } | null;
  onMulai: () => void;
  onStop: () => void;
}) {
  if (state === "aktif") {
    return (
      <div className="rounded-xl border border-[#C6E7DA] bg-leaf-soft px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="live-dot h-2 w-2 rounded-full bg-leaf" />
          <p className="text-[12px] font-extrabold text-leaf">
            Lokasi live dibagikan ke pelanggan
          </p>
          <button
            type="button"
            onClick={onStop}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-leaf/70 hover:bg-white/60"
            aria-label="Hentikan pembagian lokasi"
          >
            <X size={15} />
          </button>
        </div>
        <p className="mt-1 text-[10.5px] leading-relaxed text-leaf/80">
          {posisi
            ? `Koordinat ${posisi.lat.toFixed(5)}, ${posisi.lng.toFixed(5)} · diperbarui ${jam(
                new Date(posisi.at).toISOString(),
              )}`
            : "Menunggu sinyal GPS pertama…"}
        </p>
      </div>
    );
  }

  if (state === "ditolak") {
    return (
      <div className="rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3 py-2.5">
        <p className="text-[12px] font-bold text-[#8F2E25]">Izin lokasi ditolak</p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#8F2E25]/80">
          Pelanggan tidak bisa melihat posisi Anda. Aktifkan izin lokasi di pengaturan
          peramban, lalu tekan coba lagi.
        </p>
        <button type="button" onClick={onMulai} className="btn btn-sm btn-outline mt-2">
          <Radio size={13} /> Coba lagi
        </button>
      </div>
    );
  }

  if (state === "gagal") {
    return (
      <div className="rounded-xl border border-[#F3DFBC] bg-[#FFF4E3] px-3 py-2.5">
        <p className="text-[12px] font-bold text-[#8A520B]">GPS belum tersedia</p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#8A520B]/80">
          Perangkat tidak mengirim lokasi. Pelanggan tetap bisa melihat status pesanan.
        </p>
        <button type="button" onClick={onMulai} className="btn btn-sm btn-outline mt-2">
          <Radio size={13} /> Coba aktifkan
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-paper/70 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Radio size={15} className="text-brand" />
        <p className="text-[12px] font-bold text-navy">Bagikan lokasi live</p>
        <button
          type="button"
          onClick={onMulai}
          disabled={state === "mencari"}
          className="btn btn-sm btn-navy ml-auto"
        >
          {state === "mencari" ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Navigation size={13} />
          )}
          {state === "mencari" ? "Mencari GPS…" : "Aktifkan"}
        </button>
      </div>
      <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
        Izinkan akses lokasi agar pelanggan dapat memantau posisi Anda sampai pesanan
        tiba.
      </p>
    </div>
  );
}

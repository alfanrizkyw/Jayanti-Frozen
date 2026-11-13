"use client";

import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  Check,
  ChevronLeft,
  Pause,
  Play,
  QrCode,
  ShoppingBag,
  Snowflake,
  Truck,
} from "lucide-react";

const TAHAP = [
  { id: "intro", ms: 2800, judul: "Perkenalan" },
  { id: "pilih", ms: 4800, judul: "Pilih produk" },
  { id: "data", ms: 4800, judul: "Isi nama dan HP" },
  { id: "bayar", ms: 4400, judul: "Pilih pembayaran" },
  { id: "selesai", ms: 5000, judul: "Pesanan dibuat" },
] as const;

function Bilah({ judul, isi }: { judul: string; isi: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-white px-3 py-2.5">
      <ChevronLeft size={15} className="flex-none text-navy/50" />
      <p className="truncate text-[12px] font-extrabold text-navy">{judul}</p>
      <span className="ml-auto flex flex-none items-center gap-1 rounded-full bg-mist px-2 py-1 text-[10px] font-extrabold text-brand">
        <ShoppingBag size={11} strokeWidth={2.4} />
        {isi}
      </span>
    </div>
  );
}

export function CaraPesanDemo() {
  const [tahap, setTahap] = useState(0);
  const [jalan, setJalan] = useState(true);
  const [terlihat, setTerlihat] = useState(true);
  const [tenang, setTenang] = useState(false);
  const wadah = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTenang(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setTerlihat(entry.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tampil = tenang ? 1 : tahap;

  useEffect(() => {
    if (!jalan || !terlihat || tenang) return;
    const timer = setTimeout(
      () => setTahap((t) => (t + 1) % TAHAP.length),
      TAHAP[tahap].ms,
    );
    return () => clearTimeout(timer);
  }, [tahap, jalan, terlihat, tenang]);

  const anim = (nama: string) =>
    tenang ? undefined : { animation: nama };

  return (
    <div ref={wadah} className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 pt-3.5 md:px-5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
          <Play size={15} fill="currentColor" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-extrabold text-navy">Contoh cara pesan</p>
          <p className="text-[11.5px] text-muted">
            Berjalan otomatis dan berulang.
          </p>
        </div>
        {!tenang && (
          <button
            type="button"
            onClick={() => setJalan((j) => !j)}
            aria-label={jalan ? "Jeda contoh" : "Lanjutkan contoh"}
            className="press flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-line bg-white text-navy hover:bg-paper"
          >
            {jalan ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}
      </div>

      <div className="mt-3 bg-[linear-gradient(165deg,#123f6d,#0a1f36)] px-3 py-3 md:px-4">
        <div className="mx-auto max-w-[430px] overflow-hidden rounded-2xl bg-paper shadow-[0_18px_40px_-24px_rgba(4,16,30,0.85)]">
          {tampil === 0 && (
            <div
              key="intro"
              className="flex min-h-[300px] flex-col items-center justify-center bg-[linear-gradient(165deg,#123f6d,#0a1f36)] px-6 text-center text-white"
              style={anim("demo-masuk .5s ease both")}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-sky"
                style={anim("logo-sway 3.2s ease-in-out infinite")}
              >
                <Snowflake size={26} />
              </span>
              <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-sky">
                Yanti Frozen
              </p>
              <p className="mt-1.5 max-w-[260px] text-[21px] font-extrabold leading-[1.15]">
                Cara pesan dalam 4 langkah
              </p>
              <p className="mt-2 max-w-[250px] text-[12px] leading-relaxed text-white/70">
                Tanpa daftar akun. Cukup nama dan nomor HP.
              </p>
            </div>
          )}

          {tampil === 1 && (
            <div
              key="pilih"
              className="min-h-[300px] bg-paper text-navy"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Katalog" isi={1} />
              <div className="relative grid grid-cols-2 gap-2 p-3">
                {[
                  { nama: "Nugget Ayam", harga: "Rp42.000" },
                  { nama: "Bakso Sapi", harga: "Rp45.000" },
                ].map((p, i) => (
                  <div key={p.nama} className="rounded-xl border border-line bg-white p-2">
                    <div className="flex h-14 items-center justify-center rounded-lg bg-[linear-gradient(150deg,#e2eefb,#c6def4)] text-brand/40">
                      <Snowflake size={18} />
                    </div>
                    <p className="mt-1.5 truncate text-[10.5px] font-extrabold">{p.nama}</p>
                    <p className="text-[10px] text-muted">{p.harga}</p>
                    <div
                      className={`mt-1.5 flex h-7 items-center justify-center rounded-lg bg-mist text-[10.5px] font-extrabold text-brand ${
                        i === 0 && !tenang ? "demo-tombol" : ""
                      }`}
                    >
                      + Tambah
                    </div>
                  </div>
                ))}

                {!tenang && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[22%] top-[30%] flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(150deg,#e2eefb,#c6def4)] text-brand shadow-[0_8px_18px_-8px_rgba(16,43,80,0.7)]"
                    style={anim("demo-terbang 1.05s 1.5s cubic-bezier(.3,.6,.4,1) both")}
                  >
                    <Snowflake size={14} />
                  </span>
                )}
              </div>
              <p className="px-3 pb-3 text-[11px] leading-relaxed text-muted">
                Tekan Tambah. Produk masuk ke keranjang.
              </p>
            </div>
          )}

          {tampil === 2 && (
            <div
              key="data"
              className="min-h-[300px] bg-paper text-navy"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Data pengiriman" isi={1} />
              <div className="space-y-2.5 p-3">
                {[
                  { label: "Nama", isi: "Rina", tunda: ".2s" },
                  { label: "Nomor HP", isi: "0812 3456 7001", tunda: ".85s" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted">
                      {f.label}
                    </p>
                    <div className="mt-1 flex h-9 items-center rounded-lg border border-line bg-white px-2.5 text-[11.5px] font-semibold">
                      <span
                        className="demo-ketik inline-block"
                        style={tenang ? undefined : { animation: `demo-ketik .8s ${f.tunda} steps(9) both` }}
                      >
                        {f.isi}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-brand bg-mist text-[10.5px] font-extrabold text-brand">
                    <Truck size={13} /> Antar
                  </div>
                  <div className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-white text-[10.5px] font-bold text-navy/60">
                    Ambil
                  </div>
                </div>

                <div className="flex h-10 items-center justify-center rounded-xl bg-brand text-[11.5px] font-extrabold text-white">
                  Lanjut bayar
                </div>
              </div>
            </div>
          )}

          {tampil === 3 && (
            <div
              key="bayar"
              className="min-h-[300px] bg-paper text-navy"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Pembayaran" isi={1} />
              <div className="space-y-2 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-brand bg-mist px-2.5 py-2.5">
                  <QrCode size={16} className="flex-none text-brand" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold">QRIS</p>
                    <p className="text-[9.5px] text-muted">Bayar dari HP mana saja</p>
                  </div>
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand text-white">
                    <Check size={10} strokeWidth={3.5} />
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2.5">
                  <Banknote size={16} className="flex-none text-navy/50" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold">Tunai</p>
                    <p className="text-[9.5px] text-muted">Bayar saat pesanan diterima</p>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <p className="text-[10.5px] font-bold text-muted">Total</p>
                  <p className="stat-num text-[15px] font-extrabold">Rp93.000</p>
                </div>

                <div className="relative flex h-10 items-center justify-center rounded-xl bg-brand text-[11.5px] font-extrabold text-white">
                  Buat pesanan
                  {!tenang && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-paper bg-leaf text-white"
                      style={anim("cart-pop .45s 1.9s both")}
                    >
                      <Check size={12} strokeWidth={3.5} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {tampil === 4 && (
            <div
              key="selesai"
              className="min-h-[300px] bg-paper text-navy"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Pesanan dibuat" isi={1} />
              <div className="p-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5">
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-mist text-brand"
                    style={anim("cart-pop .5s .2s both")}
                  >
                    <Check size={17} strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted">Kode pesanan</p>
                    <p className="stat-num text-[12.5px] font-extrabold">JY261113-0102</p>
                  </div>
                </div>

                <div className="mt-2.5 rounded-xl border border-line bg-white p-3">
                  <div className="flex items-center gap-2 text-[10.5px] font-bold">
                    <span className="h-2 w-2 rounded-full bg-leaf" />
                    Diantar
                    <span className="ml-auto font-semibold text-muted">Budi · kurir toko</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-1 text-center text-[9px] font-bold">
                    {["Diterima", "Disiapkan", "Diantar"].map((s, i) => (
                      <div key={s} className={i < 2 ? "text-brand" : "text-navy"}>
                        <span
                          className={`mx-auto mb-1 block h-1.5 rounded-full ${
                            i < 2 ? "bg-brand" : "bg-navy"
                          }`}
                        />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-2.5 text-[10.5px] leading-relaxed text-muted">
                  Status bisa dicek kapan saja di menu Riwayat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 md:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-extrabold text-navy">
            {tampil === 0 ? "Perkenalan" : `Langkah ${tampil}: ${TAHAP[tampil].judul}`}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line/70">
            {!tenang && (
              <div
                key={tampil}
                className="h-full origin-left rounded-full bg-brand"
                style={{
                  animation: `demo-maju ${TAHAP[tampil].ms}ms linear both`,
                  animationPlayState: jalan && terlihat ? "running" : "paused",
                }}
              />
            )}
          </div>
        </div>
        <p className="flex-none text-[11px] font-semibold text-muted">
          {tampil === 0 ? "Mulai" : `${tampil} / 4`}
        </p>
      </div>
    </div>
  );
}

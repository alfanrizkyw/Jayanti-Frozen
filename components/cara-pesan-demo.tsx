"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Bike,
  BookOpenText,
  Check,
  ChevronDown,
  ChevronLeft,
  History,
  House,
  Landmark,
  LayoutGrid,
  MapPin,
  Minus,
  Package,
  Pause,
  Play,
  Plus,
  QrCode,
  Search,
  ShoppingBag,
  Snowflake,
  Star,
  Store,
  Truck,
} from "lucide-react";

const TAHAP = [
  { id: "intro", ms: 2600, judul: "Perkenalan" },
  { id: "katalog", ms: 4600, judul: "Pilih produk" },
  { id: "keranjang", ms: 4000, judul: "Periksa keranjang" },
  { id: "data", ms: 4600, judul: "Isi data pembeli" },
  { id: "antar", ms: 4800, judul: "Atur pengantaran" },
  { id: "bayar", ms: 4200, judul: "Pilih pembayaran" },
  { id: "kurir", ms: 5400, judul: "Kurir mengantar" },
  { id: "selesai", ms: 4400, judul: "Pesanan selesai" },
] as const;

const TAB = [
  { Ikon: House, label: "Beranda" },
  { Ikon: LayoutGrid, label: "Katalog" },
  { Ikon: ShoppingBag, label: "Keranjang" },
  { Ikon: BookOpenText, label: "Cara pesan" },
  { Ikon: History, label: "Riwayat" },
];

const POLA_QR =
  "1100111010111010100111001101001110110011100101101".split("").map((n) => n === "1");

function TabMini({ aktif, isi }: { aktif: number; isi: number }) {
  return (
    <div className="mt-auto grid flex-none grid-cols-5 border-t border-line bg-white px-1 pb-1 pt-1">
      {TAB.map(({ Ikon, label }, i) => (
        <span
          key={label}
          className={`flex flex-col items-center gap-0.5 rounded-lg py-0.5 ${
            i === aktif ? "text-brand" : "text-navy/40"
          }`}
        >
          <span className="relative">
            <Ikon size={13} strokeWidth={i === aktif ? 2.6 : 2} />
            {i === 2 && isi > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-3 min-w-3 items-center justify-center rounded-full bg-brand px-0.5 text-[6.5px] font-bold leading-none text-white">
                {isi}
              </span>
            )}
          </span>
          <span className="text-[6.5px] font-bold leading-none">{label}</span>
        </span>
      ))}
    </div>
  );
}

function Bilah({
  judul,
  isi,
  kembali = true,
}: {
  judul: string;
  isi: number;
  kembali?: boolean;
}) {
  return (
    <div className="flex flex-none items-center gap-1.5 border-b border-line bg-white px-2.5 py-2">
      {kembali ? (
        <ChevronLeft size={14} className="flex-none text-navy/45" />
      ) : (
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-[linear-gradient(160deg,#3f95dc,#1f66a8)] text-white">
          <Snowflake size={12} />
        </span>
      )}
      <p className="truncate text-[10.5px] font-extrabold text-navy">{judul}</p>
      <span className="ml-auto inline-flex flex-none items-center gap-1 rounded-full bg-mist px-1.5 py-1 text-[8px] font-extrabold text-brand">
        <ShoppingBag size={9} strokeWidth={2.6} />
        {isi}
      </span>
    </div>
  );
}

function Nomor({ n }: { n: number }) {
  return (
    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">
      {n}
    </span>
  );
}

function Bagian({
  n,
  judul,
  children,
  className = "",
}: {
  n: number;
  judul: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-white p-2.5 ${className}`}>
      <div className="flex items-center gap-1.5">
        <Nomor n={n} />
        <p className="text-[9.5px] font-extrabold text-navy">{judul}</p>
      </div>
      {children}
    </div>
  );
}

function Isian({
  label,
  isi,
  tunda,
  tenang,
}: {
  label: string;
  isi: string;
  tunda: string;
  tenang: boolean;
}) {
  return (
    <div>
      <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <div className="mt-0.5 flex h-7 items-center rounded-md border border-line bg-white px-1.5">
        <span
          className="truncate text-[9px] font-semibold text-navy"
          style={
            tenang
              ? undefined
              : { animation: `demo-ketik .7s ${tunda} steps(10) both` }
          }
        >
          {isi}
        </span>
      </div>
    </div>
  );
}

function Pilihan({
  Ikon,
  judul,
  teks,
  aktif,
}: {
  Ikon: typeof Truck;
  judul: string;
  teks: string;
  aktif?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg border px-1.5 py-1.5 ${
        aktif ? "border-brand bg-mist" : "border-line bg-white"
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-none items-center justify-center rounded-md ${
          aktif ? "bg-brand text-white" : "bg-paper text-brand"
        }`}
      >
        <Ikon size={12} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[9px] font-bold text-navy">
          {judul}
          {aktif && <Check size={9} className="text-brand" strokeWidth={3.5} />}
        </span>
        <span className="mt-0.5 block truncate text-[7.5px] text-muted">
          {teks}
        </span>
      </span>
    </div>
  );
}

function Bayar({
  Ikon,
  judul,
  teks,
  aktif,
  sorot = false,
  tenang = false,
}: {
  Ikon: typeof Banknote;
  judul: string;
  teks: string;
  aktif?: boolean;
  sorot?: boolean;
  tenang?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg border px-1.5 py-1 ${
        aktif ? "border-brand bg-mist" : "border-line bg-white"
      }`}
    >
      <Ikon
        size={12}
        className={aktif ? "flex-none text-brand" : "flex-none text-navy/50"}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[9px] font-bold text-navy">{judul}</span>
        <span className="mt-0.5 block truncate text-[7.5px] text-muted">
          {teks}
        </span>
      </span>
      <span
        className={`flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full ${
          aktif ? "bg-brand text-white" : "border border-line bg-white"
        }`}
        style={sorot && !tenang ? { animation: "cart-pop .4s .7s both" } : undefined}
      >
        {aktif && <Check size={8} strokeWidth={4} />}
      </span>
    </div>
  );
}

function Produk({
  nama,
  satuan,
  harga,
  lama,
  diskon,
  kategori,
  tombol,
  tenang,
}: {
  nama: string;
  satuan: string;
  harga: string;
  lama: string;
  diskon: string;
  kategori: string;
  tombol?: boolean;
  tenang: boolean;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
      <div className="relative flex h-[50px] items-center justify-center bg-[linear-gradient(150deg,#e2eefb,#c6def4)]">
        <Snowflake size={16} className="text-brand/35" />
        {diskon && (
          <span className="absolute left-1 top-1 rounded bg-sun px-1 py-0.5 text-[6.5px] font-extrabold leading-none text-[#3D2400]">
            {diskon}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-1.5">
        <p className="truncate text-[6.5px] font-bold uppercase tracking-[0.08em] text-brand/75">
          {kategori}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[9px] font-bold leading-tight text-navy">
          {nama}
        </p>
        <p className="text-[7.5px] text-muted">{satuan}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1">
          <span className="text-[9.5px] font-extrabold text-navy">{harga}</span>
          {lama && (
            <span className="text-[7px] text-muted line-through">{lama}</span>
          )}
        </div>
        <div
          className={`mt-1 flex h-6 items-center justify-center gap-0.5 rounded-md border border-[#C9E1F7] bg-mist text-[8px] font-extrabold text-brand ${
            tombol && !tenang ? "demo-tombol" : ""
          }`}
        >
          <Plus size={8} strokeWidth={3} /> Tambah
        </div>
      </div>
    </div>
  );
}

function BarisKeranjang({
  nama,
  satuan,
  harga,
  jumlah,
}: {
  nama: string;
  satuan: string;
  harga: string;
  jumlah: number;
}) {
  return (
    <div className="flex items-center gap-1.5 py-1.5">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[linear-gradient(150deg,#e2eefb,#c6def4)] text-brand/40">
        <Snowflake size={12} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9px] font-bold text-navy">{nama}</p>
        <p className="text-[7.5px] text-muted">{satuan}</p>
        <div className="mt-1 flex w-fit items-center gap-0.5 rounded-md border border-brand/35 bg-white p-0.5">
          <span className="flex h-4 w-4 items-center justify-center text-brand">
            <Minus size={7} strokeWidth={3} />
          </span>
          <span className="min-w-3 text-center text-[8px] font-extrabold text-navy">
            {jumlah}
          </span>
          <span className="flex h-4 w-4 items-center justify-center text-brand">
            <Plus size={7} strokeWidth={3} />
          </span>
        </div>
      </div>
      <p className="flex-none text-[9px] font-extrabold text-navy">{harga}</p>
    </div>
  );
}

function BarisRingkas({
  nama,
  jumlah,
  harga,
}: {
  nama: string;
  jumlah: number;
  harga: string;
}) {
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <span className="relative flex h-6 w-6 flex-none items-center justify-center rounded-md border border-line bg-mist text-brand/45">
        <Snowflake size={10} />
        <span className="absolute -bottom-0.5 -right-0.5 rounded bg-navy/85 px-0.5 text-[6px] font-bold leading-[1.4] text-white">
          {jumlah}×
        </span>
      </span>
      <p className="min-w-0 flex-1 truncate text-[8px] font-semibold text-navy">
        {nama}
      </p>
      <p className="flex-none text-[8px] font-bold text-navy">{harga}</p>
    </div>
  );
}

function PetaDemo({ tenang }: { tenang: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-[#E9F2F9]">
      <svg
        viewBox="0 0 400 200"
        className="block h-[124px] w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="400" height="200" fill="#E9F2F9" />
        <g fill="#D9E9F6">
          <rect x="14" y="12" width="72" height="40" rx="8" />
          <rect x="104" y="18" width="50" height="30" rx="7" />
          <rect x="238" y="10" width="64" height="34" rx="8" />
          <rect x="318" y="14" width="62" height="30" rx="7" />
          <rect x="22" y="72" width="46" height="28" rx="7" />
          <rect x="250" y="82" width="58" height="44" rx="8" />
          <rect x="334" y="86" width="46" height="40" rx="7" />
          <rect x="116" y="128" width="60" height="40" rx="8" />
          <rect x="214" y="142" width="56" height="32" rx="8" />
          <rect x="308" y="146" width="62" height="36" rx="8" />
        </g>
        <g>
          <rect x="168" y="16" width="54" height="32" rx="9" fill="#DBF0E6" />
          <circle cx="180" cy="28" r="4.5" fill="#B9DFCC" />
          <circle cx="194" cy="36" r="5.5" fill="#B9DFCC" />
          <circle cx="206" cy="26" r="3.5" fill="#B9DFCC" />
        </g>
        <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
          <path d="M0 116 H400" strokeWidth="14" />
          <path d="M212 0 V200" strokeWidth="11" />
          <path d="M0 62 H400" strokeWidth="5" opacity="0.85" />
          <path d="M100 0 V200" strokeWidth="4" opacity="0.85" />
          <path d="M320 0 V200" strokeWidth="4" opacity="0.85" />
        </g>
        <path
          d="M62 158 C118 174 184 92 334 44"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M62 158 C118 174 184 92 334 44"
          fill="none"
          stroke="#A9CDEC"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="2 6"
        />
        <path
          d="M62 158 C118 174 184 92 334 44"
          fill="none"
          stroke="#2166AC"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="0.62 1"
          pathLength={1}
        />
        <g transform="translate(62 158)">
          <circle r="13" fill="#fff" opacity="0.95" />
          <rect
            x="-7.5"
            y="-6.5"
            width="15"
            height="13"
            rx="2.5"
            fill="#102B50"
          />
          <path d="M-7.5 -2.5 H7.5" stroke="#72B9EE" strokeWidth="1.4" />
          <rect x="-3.5" y="1.5" width="7" height="5" rx="1" fill="#E8F3FF" />
        </g>
        <text
          x="62"
          y="182"
          textAnchor="middle"
          fill="#102B50"
          fontSize="8"
          fontWeight="800"
        >
          Toko
        </text>
        <g transform="translate(334 44)">
          <circle r="13" fill="#fff" opacity="0.95" />
          <circle r="9" fill="#2166AC" />
          <path
            d="M-3.5 1.5 0 -3.5 3.5 1.5v3.5a1 1 0 0 1-1 1H-2.5a1 1 0 0 1-1-1v-3.5Z"
            fill="#fff"
          />
        </g>
        <text
          x="334"
          y="66"
          textAnchor="middle"
          fill="#102B50"
          fontSize="8"
          fontWeight="800"
        >
          Alamat Anda
        </text>
        {tenang ? (
          <g transform="translate(236 74)">
            <circle r="13" fill="#2166AC" opacity="0.14" />
            <circle r="10" fill="#fff" />
            <circle r="7.5" fill="#2166AC" />
          </g>
        ) : (
          <g>
            <circle r="12" fill="#2166AC" opacity="0.14">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M62 158 C118 174 184 92 334 44"
              />
            </circle>
            <circle r="9" fill="#fff" stroke="#2166AC" strokeWidth="1.5">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M62 158 C118 174 184 92 334 44"
              />
            </circle>
            <circle r="5.5" fill="#2166AC">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M62 158 C118 174 184 92 334 44"
              />
            </circle>
          </g>
        )}
      </svg>
      <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-white/95 px-1.5 py-1 text-[6.5px] font-bold text-navy shadow-sm">
        <span className="live-dot h-1 w-1 rounded-full bg-leaf" /> KURIR DI JALAN
      </span>
      <span className="absolute bottom-1.5 right-1.5 rounded bg-white/95 px-1.5 py-1 text-[7px] font-extrabold text-navy shadow-sm">
        ± 12 menit
      </span>
    </div>
  );
}

function Timeline({ langkah, aktif }: { langkah: string[]; aktif: number }) {
  return (
    <ol className="rounded-xl border border-line bg-white px-2 py-1.5">
      {langkah.map((l, i) => {
        const selesai = i < aktif;
        const sedang = i === aktif;
        return (
          <li key={l} className="relative flex items-center gap-1.5 py-0.5">
            {i < langkah.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[7px] top-4 h-2.5 w-px ${
                  selesai ? "bg-brand" : "bg-line"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border text-[6px] font-bold ${
                selesai
                  ? "border-brand bg-brand text-white"
                  : sedang
                    ? "border-brand bg-white text-brand"
                    : "border-line bg-white text-muted"
              }`}
            >
              {selesai ? (
                <Check size={7} strokeWidth={4} />
              ) : sedang ? (
                <span className="h-1 w-1 rounded-full bg-brand" />
              ) : (
                i + 1
              )}
            </span>
            <p
              className={`text-[8px] font-bold ${
                selesai || sedang ? "text-navy" : "text-muted"
              }`}
            >
              {l}
            </p>
            {sedang && (
              <span className="ml-auto rounded-full bg-mist px-1 py-0.5 text-[6px] font-semibold text-brand">
                Sekarang
              </span>
            )}
          </li>
        );
      })}
    </ol>
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

  const anim = (nama: string) => (tenang ? undefined : { animation: nama });

  return (
    <div ref={wadah} className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 pt-3.5 md:px-5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
          <Play size={15} fill="currentColor" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-extrabold text-navy">
            Contoh cara pesan
          </p>
          <p className="text-[11.5px] text-muted">
            Berjalan sendiri dan berulang. Data contoh, bukan pesanan asli.
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
        <div className="mx-auto h-[460px] max-w-[400px] overflow-hidden rounded-2xl bg-paper text-navy shadow-[0_18px_40px_-24px_rgba(4,16,30,0.85)]">
          {tampil === 0 && (
            <div
              key="intro"
              className="flex h-full flex-col items-center justify-center bg-[linear-gradient(165deg,#123f6d,#0a1f36)] px-6 text-center text-white"
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
              <p className="mt-1.5 max-w-[270px] text-[21px] font-extrabold leading-[1.15]">
                Dari katalog sampai diantar
              </p>
              <p className="mt-2 max-w-[260px] text-[12px] leading-relaxed text-white/70">
                Ikuti satu pesanan antar, dari pilih produk sampai kurir tiba.
              </p>
            </div>
          )}

          {tampil === 1 && (
            <div
              key="katalog"
              className="relative flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <div className="flex-none border-b border-line bg-white px-2.5 pb-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[linear-gradient(160deg,#3f95dc,#1f66a8)] text-white">
                    <Snowflake size={12} />
                  </span>
                  <p className="text-[10.5px] font-extrabold leading-none text-navy">
                    Yanti Frozen
                  </p>
                  <span
                    className="ml-auto inline-flex flex-none items-center gap-1 rounded-full bg-mist px-1.5 py-1 text-[8px] font-extrabold text-brand"
                    style={anim("cart-pop .5s 2.6s both")}
                  >
                    <ShoppingBag size={9} strokeWidth={2.6} /> 1
                  </span>
                </div>
                <div className="mt-1.5 flex h-6 items-center gap-1 rounded-md border border-line bg-paper px-1.5 text-[8px] text-muted">
                  <Search size={9} /> Cari nugget, bakso, sosis
                </div>
              </div>

              <div className="flex flex-none gap-1 px-2.5 pt-2">
                {["Semua", "Nugget", "Bakso", "Sosis"].map((c, i) => (
                  <span
                    key={c}
                    className={`rounded-full px-1.5 py-0.5 text-[7.5px] font-bold ${
                      i === 0
                        ? "bg-brand text-white"
                        : "border border-line bg-white text-muted"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="grid flex-none grid-cols-2 gap-1.5 p-2.5">
                <Produk
                  nama="Nugget Ayam"
                  satuan="500 gram"
                  harga="Rp42.000"
                  lama="Rp48.000"
                  diskon="−13%"
                  kategori="Nugget"
                  tombol
                  tenang={tenang}
                />
                <Produk
                  nama="Bakso Sapi"
                  satuan="500 gram"
                  harga="Rp45.000"
                  lama=""
                  diskon=""
                  kategori="Bakso"
                  tenang={tenang}
                />
                <Produk
                  nama="Sosis Ayam"
                  satuan="500 gram"
                  harga="Rp30.000"
                  lama=""
                  diskon=""
                  kategori="Sosis"
                  tenang={tenang}
                />
                <Produk
                  nama="Kentang Goreng"
                  satuan="1 kg"
                  harga="Rp26.000"
                  lama=""
                  diskon=""
                  kategori="Olahan"
                  tenang={tenang}
                />
              </div>

              <div className="flex items-center justify-between px-2.5">
                <p className="text-[7.5px] text-muted">
                  Tekan Tambah, produk langsung masuk keranjang.
                </p>
                <span className="flex flex-none items-center gap-0.5 text-[7.5px] font-bold text-brand">
                  Lihat semua <ArrowRight size={8} />
                </span>
              </div>

              {!tenang && (
                <span
                  aria-hidden="true"
                  className="absolute z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(150deg,#e2eefb,#c6def4)] text-brand shadow-[0_8px_18px_-8px_rgba(16,43,80,0.7)]"
                  style={anim(
                    "demo-terbang 1.15s 1.4s cubic-bezier(.35,.7,.4,1) both",
                  )}
                >
                  <Snowflake size={12} />
                </span>
              )}

              <TabMini aktif={1} isi={1} />
            </div>
          )}

          {tampil === 2 && (
            <div
              key="keranjang"
              className="flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Keranjang" isi={2} />
              <div className="flex-1 space-y-1.5 overflow-hidden p-2.5">
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                  <div className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
                    <p className="text-[9px] font-extrabold text-navy">
                      Produk di keranjang{" "}
                      <span className="ml-0.5 rounded-full bg-mist px-1 text-[7.5px] text-brand">
                        2
                      </span>
                    </p>
                    <span className="text-[7.5px] font-semibold text-muted">
                      Hapus semua
                    </span>
                  </div>
                  <div className="divide-y divide-line px-2.5">
                    <BarisKeranjang
                      nama="Nugget Ayam"
                      satuan="500 gram"
                      harga="Rp42.000"
                      jumlah={1}
                    />
                    <BarisKeranjang
                      nama="Bakso Sapi"
                      satuan="500 gram"
                      harga="Rp45.000"
                      jumlah={1}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-white p-2.5">
                  <p className="text-[9px] font-extrabold text-navy">
                    Ringkasan
                  </p>
                  <div className="mt-1 flex justify-between text-[8px]">
                    <span className="text-muted">Subtotal (2 produk)</span>
                    <span className="font-bold text-navy">Rp87.000</span>
                  </div>
                  <div className="mt-0.5 flex justify-between text-[8px]">
                    <span className="text-muted">Ongkir</span>
                    <span className="text-muted">Dihitung saat checkout</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 rounded-md bg-paper px-1.5 py-1 text-[7.5px] font-semibold text-navy">
                    <Truck size={9} className="flex-none text-brand" />
                    Tambah belanja lagi untuk gratis ongkir
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#DCE9F6]">
                    <div className="h-full w-[72%] rounded-full bg-brand" />
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between border-t border-line pt-1.5">
                    <span className="text-[9px] font-bold text-navy">
                      Total barang
                    </span>
                    <span className="text-[12px] font-extrabold text-navy">
                      Rp87.000
                    </span>
                  </div>
                  <div className="mt-1 flex h-7 items-center justify-center gap-1 rounded-lg bg-brand text-[9px] font-extrabold text-white">
                    Lanjut ke checkout <ArrowRight size={9} />
                  </div>
                  <div className="mt-1 flex h-7 items-center justify-center rounded-lg border border-line bg-white text-[9px] font-bold text-navy">
                    Lanjut belanja
                  </div>
                  <p className="mt-1.5 flex items-start gap-1 text-[7px] leading-relaxed text-muted">
                    <Package size={8} className="mt-0.5 flex-none" />
                    Keranjang tersimpan di perangkat ini.
                  </p>
                </div>
              </div>
              <TabMini aktif={2} isi={2} />
            </div>
          )}

          {tampil === 3 && (
            <div
              key="data"
              className="flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Checkout" isi={2} />
              <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-brand">
                  Langkah 1 dari 3
                </p>

                <Bagian n={1} judul="Data pembeli">
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    <Isian
                      label="Nama lengkap"
                      isi="Siti Aisyah"
                      tunda=".2s"
                      tenang={tenang}
                    />
                    <Isian
                      label="HP / WhatsApp"
                      isi="0812-0000-7788"
                      tunda=".6s"
                      tenang={tenang}
                    />
                  </div>
                  <p className="mt-1 text-[7px] text-muted">
                    Nomor HP dipakai admin untuk konfirmasi.
                  </p>
                </Bagian>

                <Bagian n={2} judul="Cara menerima">
                  <div className="mt-1.5 space-y-1">
                    <Pilihan
                      Ikon={Truck}
                      judul="Antar ke rumah"
                      teks="Ongkir Rp8.000 · kurir toko"
                      aktif
                    />
                    <Pilihan
                      Ikon={Store}
                      judul="Ambil di toko"
                      teks="Gratis · siap setelah dikonfirmasi"
                    />
                  </div>
                </Bagian>

                <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-1.5">
                  <ShoppingBag size={10} className="flex-none text-brand" />
                  <p className="min-w-0 truncate text-[8px] font-semibold text-navy">
                    2 produk · Nugget Ayam, Bakso Sapi
                  </p>
                  <span className="ml-auto flex-none text-[9px] font-extrabold text-navy">
                    Rp87.000
                  </span>
                </div>

                <div className="mt-auto flex h-8 items-center justify-center gap-1 rounded-lg bg-brand text-[9px] font-extrabold text-white">
                  Lanjut ke alamat <ArrowRight size={9} />
                </div>
              </div>
              <TabMini aktif={2} isi={2} />
            </div>
          )}

          {tampil === 4 && (
            <div
              key="antar"
              className="flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Checkout" isi={2} />
              <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-brand">
                  Langkah 2 dari 3
                </p>

                <Bagian n={2} judul="Alamat pengantaran">
                  <div className="mt-1.5 min-h-[42px] rounded-md border border-brand/40 bg-white px-1.5 py-1 text-[8px] font-semibold leading-snug text-navy">
                    <span
                      className="line-clamp-3"
                      style={
                        tenang
                          ? undefined
                          : { animation: "demo-ketik .9s .2s steps(12) both" }
                      }
                    >
                      Jl. Contoh No. 12, Kel. Sukabumi, Probolinggo. Patokan:
                      dekat masjid.
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-[7px] text-muted">
                    <MapPin size={8} className="flex-none text-brand" />
                    Kurir menghubungi nomor HP saat tiba.
                  </p>
                  <p className="mt-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-muted">
                    Jadwal
                  </p>
                  <div className="mt-0.5 flex h-6 items-center justify-between rounded-md border border-line bg-white px-1.5 text-[8px] font-semibold text-navy">
                    Secepatnya
                    <ChevronDown size={9} className="text-navy/45" />
                  </div>
                </Bagian>

                <div className="rounded-xl border border-line bg-white p-2.5">
                  <p className="text-[9px] font-extrabold text-navy">
                    Ringkasan pesanan
                  </p>
                  <BarisRingkas
                    nama="Nugget Ayam · 500 gram"
                    jumlah={1}
                    harga="Rp42.000"
                  />
                  <BarisRingkas
                    nama="Bakso Sapi · 500 gram"
                    jumlah={1}
                    harga="Rp45.000"
                  />
                  <div className="mt-1 flex justify-between border-t border-line pt-1 text-[8px]">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-bold text-navy">Rp87.000</span>
                  </div>
                  <div className="mt-0.5 flex justify-between text-[8px]">
                    <span className="text-muted">Ongkir (antar kurir)</span>
                    <span className="font-bold text-navy">Rp8.000</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1">
                    <span className="text-[8.5px] font-bold text-navy">
                      Total bayar
                    </span>
                    <span className="text-[11.5px] font-extrabold text-navy">
                      Rp95.000
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex h-8 items-center justify-center gap-1 rounded-lg bg-brand text-[9px] font-extrabold text-white">
                  Lanjut ke pembayaran <ArrowRight size={9} />
                </div>
              </div>
              <TabMini aktif={2} isi={2} />
            </div>
          )}

          {tampil === 5 && (
            <div
              key="bayar"
              className="flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Checkout" isi={2} />
              <div className="flex flex-1 flex-col gap-1 p-2.5">
                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-brand">
                  Langkah 3 dari 3
                </p>

                <Bagian n={3} judul="Pembayaran">
                  <div className="mt-1.5 space-y-1">
                    <Bayar
                      Ikon={Banknote}
                      judul="Tunai"
                      teks="Bayar saat pesanan diterima"
                    />
                    <Bayar
                      Ikon={QrCode}
                      judul="QRIS"
                      teks="Scan kode QRIS dari admin"
                      aktif
                      sorot
                      tenang={tenang}
                    />
                    <Bayar
                      Ikon={Landmark}
                      judul="Transfer"
                      teks="Transfer bank, lalu konfirmasi"
                    />
                  </div>
                </Bagian>

                <div className="flex items-center gap-2 rounded-xl border border-line bg-white p-1.5">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 flex-none grid-cols-7 gap-[1.5px] rounded-md border border-line bg-white p-1"
                  >
                    {POLA_QR.map((isi, i) => (
                      <span
                        key={`${i}-${isi ? 1 : 0}`}
                        className={`rounded-[1px] ${isi ? "bg-navy" : "bg-transparent"}`}
                      />
                    ))}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-extrabold text-navy">
                      Contoh kode QRIS
                    </p>
                    <p className="mt-0.5 text-[7px] leading-snug text-muted">
                      Scan, lalu bayar Rp95.000. Kode asli dikirim admin.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-white p-2.5">
                  <div className="flex justify-between text-[8px]">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-bold text-navy">Rp87.000</span>
                  </div>
                  <div className="mt-0.5 flex justify-between text-[8px]">
                    <span className="text-muted">Ongkir</span>
                    <span className="font-bold text-navy">Rp8.000</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1">
                    <span className="text-[8.5px] font-bold text-navy">
                      Total bayar
                    </span>
                    <span className="text-[12px] font-extrabold text-navy">
                      Rp95.000
                    </span>
                  </div>
                </div>

                <div className="relative mt-auto flex h-8 items-center justify-center rounded-lg bg-brand text-[9px] font-extrabold text-white">
                  Buat pesanan
                  {!tenang && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-paper bg-leaf text-white"
                      style={anim("cart-pop .45s 1.6s both")}
                    >
                      <Check size={9} strokeWidth={3.5} />
                    </span>
                  )}
                </div>
              </div>
              <TabMini aktif={2} isi={2} />
            </div>
          )}

          {tampil === 6 && (
            <div
              key="kurir"
              className="flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Pesanan" isi={0} />
              <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full border border-[#C9E1F7] bg-mist px-1.5 py-0.5 text-[7px] font-bold text-brand">
                    Diantar
                  </span>
                  <span className="text-[7px] font-semibold text-muted">
                    Atas nama Siti
                  </span>
                  <span className="ml-auto text-[7.5px] font-extrabold text-navy">
                    YF-0000-0001
                  </span>
                </div>

                <PetaDemo tenang={tenang} />

                <div className="flex items-center gap-1.5 rounded-lg border border-line bg-white p-1.5">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">
                    B
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[8.5px] font-bold text-navy">
                      Budi
                      <span className="inline-flex items-center gap-0.5 text-[7px] font-semibold text-[#8A520B]">
                        <Star size={7} fill="currentColor" /> 4.9
                      </span>
                    </p>
                    <p className="flex items-center gap-1 text-[7px] text-muted">
                      <Bike size={7} /> Motor · kurir toko
                    </p>
                    <p className="flex items-center gap-1 text-[6.5px] text-muted">
                      <span className="live-dot h-1 w-1 rounded-full bg-leaf" />
                      Lokasi GPS aktif
                    </p>
                  </div>
                  <span className="flex h-6 flex-none items-center gap-0.5 rounded-md border border-line bg-white px-1.5 text-[7px] font-bold text-navy">
                    <Truck size={8} /> Hubungi
                  </span>
                </div>

                <div className="flex items-start gap-1 rounded-md bg-mist px-1.5 py-1 text-[7.5px] leading-snug text-navy/80">
                  <MapPin size={8} className="mt-0.5 flex-none text-brand" />
                  Jl. Contoh No. 12, Probolinggo
                </div>

                <div className="rounded-lg border border-line bg-white px-2 py-1.5">
                  <div className="flex justify-between text-[7.5px]">
                    <span className="text-muted">Isi pesanan</span>
                    <span className="font-semibold text-navy">
                      2 produk · Nugget, Bakso
                    </span>
                  </div>
                  <div className="mt-0.5 flex justify-between text-[7.5px]">
                    <span className="text-muted">Total bayar</span>
                    <span className="font-bold text-navy">Rp95.000 · QRIS</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Timeline
                    langkah={[
                      "Pesanan diterima",
                      "Dikonfirmasi",
                      "Diantar kurir",
                      "Selesai",
                    ]}
                    aktif={2}
                  />
                </div>
              </div>
              <TabMini aktif={4} isi={0} />
            </div>
          )}

          {tampil === 7 && (
            <div
              key="selesai"
              className="flex h-full flex-col"
              style={anim("demo-masuk .45s ease both")}
            >
              <Bilah judul="Pesanan selesai" isi={0} />
              <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                <div className="flex items-start gap-1.5 rounded-lg border border-[#C6E7DA] bg-leaf-soft px-2 py-2">
                  <span
                    className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-leaf"
                    style={anim("cart-pop .5s .2s both")}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold text-[#12563F]">
                      Pesanan sudah diterima
                    </p>
                    <p className="mt-0.5 text-[7.5px] leading-relaxed text-[#1F7A5C]/85">
                      Kode YF-0000-0001 · atas nama Siti Aisyah
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-white p-2">
                  <p className="text-[8.5px] font-extrabold text-navy">
                    Foto bukti saat pesanan diterima
                  </p>
                  <div className="mt-1 flex h-[62px] flex-col items-center justify-center rounded-lg border border-dashed border-[#C9E1F7] bg-paper text-brand/60">
                    <Package size={16} />
                    <p className="mt-0.5 text-[7px] font-semibold text-muted">
                      bukti-antar.jpg
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-white p-2">
                  <div className="flex justify-between text-[8px]">
                    <span className="text-muted">Total dibayar</span>
                    <span className="font-extrabold text-navy">Rp95.000</span>
                  </div>
                  <div className="mt-0.5 flex justify-between text-[8px]">
                    <span className="text-muted">Pembayaran</span>
                    <span className="font-semibold text-navy">QRIS</span>
                  </div>
                  <div className="mt-0.5 flex justify-between text-[8px]">
                    <span className="text-muted">Pengantaran</span>
                    <span className="font-semibold text-navy">Antar · Budi</span>
                  </div>
                </div>

                <Timeline
                  langkah={[
                    "Pesanan diterima",
                    "Dikonfirmasi",
                    "Diantar kurir",
                    "Selesai",
                  ]}
                  aktif={4}
                />

                <div className="mt-auto grid grid-cols-2 gap-1.5">
                  <span className="flex h-7 items-center justify-center gap-1 rounded-lg bg-brand text-[8.5px] font-extrabold text-white">
                    Pesan lagi
                  </span>
                  <span className="flex h-7 items-center justify-center gap-1 rounded-lg border border-line bg-white text-[8.5px] font-bold text-navy">
                    <History size={9} /> Riwayat
                  </span>
                </div>
              </div>
              <TabMini aktif={4} isi={0} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 md:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-extrabold text-navy">
            {tampil === 0 ? "Perkenalan" : `${tampil}. ${TAHAP[tampil].judul}`}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line/70">
            {!tenang && (
              <div
                key={tampil}
                className="h-full origin-left rounded-full bg-brand"
                style={{
                  animation: `demo-maju ${TAHAP[tampil].ms}ms linear both`,
                  animationPlayState:
                    jalan && terlihat ? "running" : "paused",
                }}
              />
            )}
          </div>
        </div>
        <p className="flex-none text-[11px] font-semibold text-muted">
          {tampil === 0 ? "Mulai" : `${tampil} / ${TAHAP.length - 1}`}
        </p>
      </div>
    </div>
  );
}

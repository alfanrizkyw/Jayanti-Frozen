"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bike,
  BookOpenText,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Crosshair,
  History,
  House,
  Landmark,
  Languages,
  LayoutGrid,
  Lock,
  MapPin,
  Minus,
  Moon,
  PackageOpen,
  Phone,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  ShoppingBag,
  Snowflake,
  Star,
  Store,
  Sun,
  Trash2,
  Truck,
} from "lucide-react";
import { rupiah } from "@/lib/format";
import { AvatarPeran } from "./avatar-peran";
import { Gambar } from "./gambar";
import { WhatsAppIcon } from "./whatsapp-icon";

const TAHAP = [
  {
    id: "beranda",
    judul: "Buka beranda",
    ket: "Cek jam buka dan promo. Kolom cari membantu kalau sudah tahu produknya.",
  },
  {
    id: "katalog",
    judul: "Pilih produk",
    ket: "Tekan Tambah. Produk langsung masuk keranjang tanpa daftar akun.",
  },
  {
    id: "keranjang",
    judul: "Periksa keranjang",
    ket: "Ubah jumlah bila perlu, lalu tekan Lanjut ke checkout.",
  },
  {
    id: "data",
    judul: "Isi data pembeli",
    ket: "Cukup nama dan nomor HP. Admin mengonfirmasi lewat WhatsApp.",
  },
  {
    id: "titik",
    judul: "Tandai titik antar",
    ket: "Tulis alamat, lalu tekan Pilih lokasi saya. Geser pin bila titiknya meleset.",
  },
  {
    id: "bayar",
    judul: "Pilih pembayaran",
    ket: "Pesanan antar memakai QRIS atau transfer. Tunai hanya untuk ambil di toko.",
  },
  {
    id: "kurir",
    judul: "Ikuti kurir",
    ket: "Status dan posisi kurir tampil di halaman pesanan, diperbarui otomatis.",
  },
  {
    id: "selesai",
    judul: "Beri ulasan",
    ket: "Setelah pesanan selesai, beri bintang dan ulasan untuk toko.",
  },
] as const;

const TAB = [
  { Ikon: House, label: "Beranda", utama: false },
  { Ikon: LayoutGrid, label: "Katalog", utama: false },
  { Ikon: ShoppingBag, label: "Keranjang", utama: true },
  { Ikon: BookOpenText, label: "Cara pesan", utama: false },
  { Ikon: History, label: "Riwayat", utama: false },
];

type ProdukContoh = {
  nama: string;
  satuan: string;
  kategori: string;
  harga: number;
  lama: number;
  gambar: string;
  jumlah: number;
};

const PRODUK: ProdukContoh[] = [
  {
    nama: "Chicken Nugget",
    satuan: "500 g",
    kategori: "Nugget & Sosis",
    harga: 27900,
    lama: 32000,
    gambar: "/produk/nugget.jpg",
    jumlah: 1,
  },
  {
    nama: "Sosis Sapi",
    satuan: "500 g",
    kategori: "Nugget & Sosis",
    harga: 28000,
    lama: 0,
    gambar: "/produk/sosis.jpg",
    jumlah: 0,
  },
  {
    nama: "Bakso Sapi",
    satuan: "500 g",
    kategori: "Bakso",
    harga: 30000,
    lama: 0,
    gambar: "/produk/bakso.jpg",
    jumlah: 1,
  },
  {
    nama: "Kentang Goreng",
    satuan: "1 kg",
    kategori: "Kentang",
    harga: 34900,
    lama: 40000,
    gambar: "/produk/kentang.jpg",
    jumlah: 0,
  },
];

const POLA_QR = Array.from({ length: 169 }, (_, i) => {
  const x = i % 13;
  const y = Math.floor(i / 13);
  return (x * 7 + y * 5 + ((x * y) % 3)) % 4 === 0;
});

const LANGKAH_PESANAN = [
  "Pesanan diterima",
  "Dikonfirmasi",
  "Sedang disiapkan",
  "Diantar kurir",
  "Selesai",
];

function LogoKecil() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="flex-none"
      >
        <ellipse cx="24" cy="30.6" rx="13.3" ry="12.9" fill="#102B50" />
        <ellipse cx="24" cy="31.7" rx="10.3" ry="9.2" fill="#FCFDFF" />
        <circle cx="20.3" cy="28.8" r="1.9" fill="#102B50" />
        <circle cx="27.7" cy="28.8" r="1.9" fill="#102B50" />
        <path
          d="M21.7 32.4h4.6L25 34.7c-.55.7-1.45.7-2 0l-1.3-2.3Z"
          fill="#F2A03A"
          stroke="#F2A03A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M13.3 16.7c-3.1 0-5.4-2.2-5.4-5.1 0-2.7 2-4.9 4.7-5.1.7-2.5 3-4.2 5.7-4.2 1.6 0 3.1.7 4.1 1.9.9-1.1 2.2-1.7 3.7-1.7 2.3 0 4.3 1.5 5 3.6 2.8-.1 4.9 2 4.9 4.8 0 2.9-2.3 5.2-5.3 5.2H13.3Z"
          fill="#fff"
          stroke="#102B50"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <rect
          x="13.5"
          y="15.2"
          width="21"
          height="5.2"
          rx="2"
          fill="#E8F3FF"
          stroke="#102B50"
          strokeWidth="1.6"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-extrabold leading-none tracking-[-0.02em] text-navy">
          Yanti
        </span>
        <span className="mt-[2px] text-[4.5px] font-bold uppercase tracking-[0.3em] text-navy">
          Frozen
        </span>
      </span>
    </span>
  );
}

function HeaderMini() {
  return (
    <div className="flex h-9 flex-none items-center gap-2 border-b border-line/80 bg-paper px-2.5">
      <LogoKecil />
      <span className="ml-auto flex items-center gap-2 text-navy/60">
        <Languages size={12} />
        <Moon size={12} />
      </span>
    </div>
  );
}

function TabMini({ aktif, isi }: { aktif: number; isi: number }) {
  return (
    <div className="relative mt-auto flex-none border-t border-line/80 bg-paper/95 px-1.5 pb-1 pt-1.5">
      <div className="relative grid grid-cols-5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-0 w-1/5 rounded-lg bg-mist ring-1 ring-line transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${Math.max(aktif, 0) * 100}%)`,
            opacity: TAB[aktif].utama ? 0 : 1,
          }}
        />
        {TAB.map((tab, i) => {
          const Ikon = tab.Ikon;
          const aktifIni = i === aktif;

          if (tab.utama) {
            return (
              <span
                key={tab.label}
                className="relative flex min-h-[34px] flex-col items-center justify-end pb-0.5"
              >
                <span className="absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-[14px] items-center justify-center rounded-full bg-[linear-gradient(160deg,#3f95dc,#1f66a8)] text-white ring-[3px] ring-paper">
                  <ShoppingBag size={14} strokeWidth={2.2} />
                  {isi > 0 && (
                    <span className="stat-num absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-navy px-0.5 text-[6px] font-bold text-white ring-1 ring-paper">
                      {isi}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[6.5px] font-bold leading-none ${
                    aktifIni ? "text-brand" : "text-navy/70"
                  }`}
                >
                  {tab.label}
                </span>
              </span>
            );
          }

          return (
            <span
              key={tab.label}
              className={`relative flex min-h-[34px] flex-col items-center justify-end gap-0.5 pb-0.5 text-[6.5px] font-bold leading-none ${
                aktifIni ? "text-brand" : "text-navy/70"
              }`}
            >
              <Ikon size={13} strokeWidth={2.1} />
              {tab.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function AppMini({
  aktif,
  isi,
  children,
}: {
  aktif: number;
  isi: number;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col bg-paper text-navy">
      <HeaderMini />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      <TabMini aktif={aktif} isi={isi} />
    </div>
  );
}

function ChipMini({
  children,
  aktif = false,
}: {
  children: ReactNode;
  aktif?: boolean;
}) {
  return (
    <span
      className={`inline-flex min-h-[18px] flex-none items-center gap-1 rounded-full border px-2 text-[7px] font-bold ${
        aktif
          ? "border-navy bg-navy text-white"
          : "border-line bg-white text-navy"
      }`}
    >
      {children}
    </span>
  );
}

function JudulHalaman({ judul, teks }: { judul: string; teks: string }) {
  return (
    <div className="px-2.5 pt-1.5">
      <p className="flex items-center gap-0.5 text-[6.5px] text-muted">
        Beranda <ChevronRight size={7} />
        <span className="font-semibold text-navy">{judul}</span>
      </p>
      <h3 className="mt-0.5 text-[13px] font-extrabold leading-tight text-navy">
        {judul}
      </h3>
      <p className="mt-0.5 text-[7px] leading-relaxed text-muted">{teks}</p>
    </div>
  );
}

function ProdukMini({ p }: { p: ProdukContoh }) {
  const diskon = p.lama > 0 ? Math.round((1 - p.harga / p.lama) * 100) : 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card">
      <div className="relative h-[50px] overflow-hidden bg-mist">
        <Gambar
          src={p.gambar}
          alt={p.nama}
          fill
          sizes="160px"
          className="object-cover"
        />
        {diskon > 0 && (
          <span className="absolute left-1 top-1 rounded bg-sun px-1 py-0.5 text-[6px] font-extrabold leading-none text-[#3D2400]">
            −{diskon}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-1.5">
        <p className="truncate text-[5.5px] font-bold uppercase tracking-[0.08em] text-brand/75">
          {p.kategori}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[8px] font-bold leading-tight text-navy">
          {p.nama}
        </p>
        <p className="text-[6.5px] text-muted">{p.satuan}</p>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1">
          <span className="stat-num text-[8.5px] font-extrabold text-navy">
            {rupiah(p.harga)}
          </span>
          {p.lama > 0 && (
            <span className="stat-num text-[6px] text-muted line-through">
              {rupiah(p.lama)}
            </span>
          )}
        </div>
        <div className="mt-auto pt-1">
          {p.jumlah > 0 ? (
            <div>
              <div className="flex items-center gap-0.5 rounded-md border border-brand/35 bg-mist p-0.5">
                <span className="flex h-4 w-4 items-center justify-center text-brand">
                  <Minus size={7} strokeWidth={2.6} />
                </span>
                <span className="stat-num flex-1 text-center text-[7.5px] font-extrabold text-navy">
                  {p.jumlah}
                </span>
                <span className="flex h-4 w-4 items-center justify-center text-brand">
                  <Plus size={7} strokeWidth={2.6} />
                </span>
              </div>
              <p className="mt-0.5 text-center text-[5.5px] font-bold text-brand">
                Ada di keranjang
              </p>
            </div>
          ) : (
            <div className="flex min-h-[22px] items-center justify-center gap-0.5 rounded-md border border-[#C9E1F7] bg-mist text-[7px] font-extrabold text-brand">
              <Plus size={7} strokeWidth={2.6} /> Tambah
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SectionMini({
  n,
  judul,
  children,
}: {
  n: number;
  judul: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-2">
      <div className="flex items-center gap-1.5">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[6.5px] font-bold text-white">
          {n}
        </span>
        <h4 className="text-[8.5px] font-extrabold text-navy">{judul}</h4>
      </div>
      {children}
    </section>
  );
}

function IsianMini({
  label,
  nilai,
  placeholder,
  area = false,
}: {
  label: string;
  nilai?: string;
  placeholder: string;
  area?: boolean;
}) {
  return (
    <div className={area ? "mt-1.5" : "mt-1"}>
      <p className="text-[6px] font-bold text-navy">{label}</p>
      <div
        className={`mt-0.5 rounded-md border border-line bg-white px-1.5 ${
          area ? "min-h-[30px] py-1" : "flex h-6 items-center"
        }`}
      >
        {nilai ? (
          <span
            className={`block text-[7px] font-semibold leading-snug text-navy ${
              area ? "" : "truncate"
            }`}
          >
            {nilai}
          </span>
        ) : (
          <span className="block text-[7px] text-muted">{placeholder}</span>
        )}
      </div>
    </div>
  );
}

function OpsiMini({
  Ikon,
  judul,
  teks,
  aktif = false,
  mati = false,
}: {
  Ikon: typeof Truck;
  judul: string;
  teks: string;
  aktif?: boolean;
  mati?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-1.5 rounded-lg border p-1.5 ${
        mati
          ? "border-line/70 bg-paper/60 opacity-60"
          : aktif
            ? "border-brand bg-mist ring-1 ring-brand/25"
            : "border-line bg-white"
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded ${
          aktif ? "bg-brand text-white" : "bg-paper text-brand"
        }`}
      >
        <Ikon size={10} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-0.5 text-[7px] font-bold text-navy">
          {judul}
          {aktif && <Check size={7} className="text-brand" strokeWidth={3.5} />}
        </span>
        <span className="mt-0.5 block text-[5.5px] leading-snug text-muted">
          {teks}
        </span>
      </span>
    </div>
  );
}

function BayarMini({
  Ikon,
  judul,
  teks,
  aktif = false,
  mati = false,
}: {
  Ikon: typeof Banknote;
  judul: string;
  teks: string;
  aktif?: boolean;
  mati?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border p-1.5 ${
        mati
          ? "border-line/70 bg-paper/60 opacity-60"
          : aktif
            ? "border-brand bg-mist ring-1 ring-brand/25"
            : "border-line bg-white"
      }`}
    >
      <span className="flex items-center justify-between">
        <Ikon size={11} className={aktif ? "text-brand" : "text-navy/60"} />
        {aktif && (
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-brand text-white">
            <Check size={6} strokeWidth={4} />
          </span>
        )}
      </span>
      <span className="text-[7px] font-bold text-navy">{judul}</span>
      <span className="text-[5.5px] leading-snug text-muted">{teks}</span>
    </div>
  );
}

function QrMini() {
  return (
    <svg viewBox="0 0 29 29" className="h-14 w-14" aria-hidden="true">
      <rect width="29" height="29" fill="#fff" />
      {POLA_QR.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={3 + (i % 13)}
            y={3 + Math.floor(i / 13)}
            width="1"
            height="1"
            fill="#102b50"
          />
        ) : null,
      )}
      {[
        [0, 0],
        [22, 0],
        [0, 22],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#102b50" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#102b50" />
        </g>
      ))}
    </svg>
  );
}

function PetaMini({ mode }: { mode: "pilih" | "kurir" }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-[#E9F2F9]">
      <svg
        viewBox="0 0 400 118"
        className="block h-[104px] w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="400" height="118" fill="#E9F2F9" />
        <g fill="#D9E9F6">
          <rect x="12" y="8" width="66" height="24" rx="6" />
          <rect x="96" y="10" width="44" height="18" rx="5" />
          <rect x="150" y="6" width="48" height="22" rx="6" />
          <rect x="234" y="8" width="58" height="20" rx="5" />
          <rect x="318" y="10" width="56" height="18" rx="5" />
          <rect x="18" y="44" width="42" height="16" rx="5" />
          <rect x="248" y="46" width="52" height="22" rx="6" />
          <rect x="334" y="48" width="42" height="20" rx="5" />
          <rect x="112" y="86" width="54" height="24" rx="6" />
          <rect x="212" y="88" width="48" height="20" rx="5" />
          <rect x="306" y="86" width="58" height="24" rx="6" />
        </g>
        <rect x="166" y="34" width="48" height="20" rx="6" fill="#DBF0E6" />
        <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
          <path d="M0 72 H400" strokeWidth="13" />
          <path d="M212 0 V118" strokeWidth="9" />
          <path d="M0 34 H400" strokeWidth="4" opacity="0.85" />
          <path d="M100 0 V118" strokeWidth="3.5" opacity="0.85" />
          <path d="M322 0 V118" strokeWidth="3.5" opacity="0.85" />
        </g>
        <text
          x="24"
          y="66"
          fill="#102B50"
          fontSize="8"
          fontWeight="800"
          textAnchor="middle"
        >
          Toko
        </text>
      </svg>

      <span className="absolute left-[7%] top-[54%] flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-navy text-white">
          <Snowflake size={5} />
        </span>
      </span>

      {mode === "kurir" ? (
        <>
          <span className="absolute left-[58%] top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white">
            <AvatarPeran peran="kurir" ukuran={20} />
          </span>
          <span className="absolute left-[84%] top-[30%] -translate-x-1/2 -translate-y-1/2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white ring-2 ring-white">
              <MapPin size={8} />
            </span>
          </span>
          <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded bg-white/95 px-1 py-0.5 text-[5.5px] font-bold text-navy shadow-sm">
            <span className="live-dot h-1 w-1 rounded-full bg-leaf" /> LOKASI
            KURIR
          </span>
          <span className="absolute bottom-1.5 right-1.5 rounded bg-white/95 px-1 py-0.5 text-[6px] font-extrabold text-navy shadow-sm">
            ± 20 menit
          </span>
        </>
      ) : (
        <>
          <span className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-[0_3px_8px_rgba(16,43,80,0.35)] ring-2 ring-white">
              <MapPin size={10} />
            </span>
          </span>
          <span className="absolute left-1.5 top-1.5 rounded bg-white/95 px-1 py-0.5 text-[5.5px] font-bold text-navy shadow-sm">
            PILIH TITIK
          </span>
          <span className="absolute right-1.5 top-1.5 flex gap-0.5">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-white text-[7px] font-bold text-navy shadow-sm">
              +
            </span>
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-white text-[7px] font-bold text-navy shadow-sm">
              −
            </span>
          </span>
          <span className="absolute bottom-1.5 left-1.5 rounded bg-white/95 px-1 py-0.5 text-[5.5px] font-semibold text-muted shadow-sm">
            Geser pin bila perlu
          </span>
        </>
      )}
    </div>
  );
}

function TimelineMini({
  aktif,
  selesai = false,
}: {
  aktif: number;
  selesai?: boolean;
}) {
  return (
    <ol className="rounded-lg border border-line bg-white px-2 py-1.5">
      {LANGKAH_PESANAN.map((l, i) => {
        const beres = selesai || i < aktif;
        const sedang = !selesai && i === aktif;
        return (
          <li key={l} className="relative flex items-center gap-1.5 py-0.5">
            {i < LANGKAH_PESANAN.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[5px] top-3 h-1.5 w-px ${
                  beres ? "bg-brand" : "bg-line"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-2.5 w-2.5 flex-none items-center justify-center rounded-full border text-[5px] font-bold ${
                beres
                  ? "border-brand bg-brand text-white"
                  : sedang
                    ? "border-brand bg-white text-brand"
                    : "border-line bg-white text-muted"
              }`}
            >
              {beres ? (
                <Check size={5} strokeWidth={4.5} />
              ) : sedang ? (
                <span className="h-1 w-1 rounded-full bg-brand" />
              ) : (
                i + 1
              )}
            </span>
            <p
              className={`text-[6.5px] font-bold ${
                beres || sedang ? "text-navy" : "text-muted"
              }`}
            >
              {l}
            </p>
            {sedang && (
              <span className="ml-auto rounded-full bg-mist px-1 py-px text-[5px] font-semibold text-brand">
                Status sekarang
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function LayarBeranda() {
  return (
    <AppMini aktif={0} isi={2}>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Gambar
          src="/brand/hero-promo.jpg"
          alt="Aneka frozen food Yanti Frozen"
          fill
          priority
          sizes="400px"
          className="object-cover object-[74%_48%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/45"
        />
        <div className="relative px-2.5 pb-2.5 pt-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="inline-flex min-h-[16px] items-center gap-0.5 rounded-full border border-white/15 bg-white/10 px-1.5 text-[6px] font-semibold text-white/85">
              <Sun size={7} className="text-[#8ee0a8]" /> Buka · 08.00 – 21.00
            </span>
            <span className="inline-flex min-h-[16px] items-center gap-0.5 rounded-full border border-white/15 bg-white/10 px-1.5 text-[6px] font-semibold text-white/85">
              <MapPin size={7} className="text-sky" /> Probolinggo
            </span>
          </div>

          <h1 className="mt-1.5 max-w-[240px] text-[16px] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Frozen food,
            <br />
            <span className="text-sky">siap masak</span> kapan saja.
          </h1>
          <p className="mt-1 max-w-[210px] text-[7px] leading-relaxed text-white/75">
            Pesan antar atau ambil sendiri. Bayar tunai, QRIS, atau transfer.
          </p>

          <div className="mt-2 flex gap-1">
            <div className="relative min-w-0 flex-1">
              <Search
                size={9}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <div className="flex h-7 items-center rounded-lg bg-white pl-5 pr-1.5 text-[7px] text-muted">
                Cari nugget, bakso…
              </div>
            </div>
            <span className="flex h-7 flex-none items-center rounded-lg bg-sky px-2 text-[7px] font-bold text-navy">
              Cari
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-1.5 py-1">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded bg-white/10 text-sky">
              <Snowflake size={9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[5px] font-extrabold uppercase tracking-[0.14em] text-sky">
                HEMAT 20%
              </p>
              <p className="truncate text-[7px] font-extrabold">
                PROMO, Beli Duo Lebih Hemat!
              </p>
            </div>
            <span className="flex h-5 flex-none items-center gap-0.5 rounded bg-white px-1 text-[5.5px] font-bold text-navy">
              Lihat <ArrowRight size={6} />
            </span>
          </div>
        </div>
      </section>

      <div className="px-2.5 pt-2">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="flex min-h-[26px] items-center gap-1.5 px-2">
            <span className="flex h-4 w-4 flex-none items-center justify-center rounded bg-mist text-brand">
              <WhatsAppIcon size={9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[7px] font-extrabold text-navy">
                Butuh bantuan?
              </p>
              <p className="truncate text-[5.5px] text-muted">
                Chat langsung ke admin.
              </p>
            </div>
            <ChevronRight size={8} className="text-muted" />
          </div>
          <div className="flex min-h-[26px] items-center gap-1.5 border-t border-line px-2">
            <span className="flex h-4 w-4 flex-none items-center justify-center rounded bg-mist text-brand">
              <MapPin size={9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[7px] font-extrabold text-navy">Lokasi toko</p>
              <p className="truncate text-[5.5px] text-muted">
                Pondok Pabean Indah Blok N No. 10
              </p>
            </div>
            <ChevronRight size={8} className="text-muted" />
          </div>
        </div>

        <div className="mt-2">
          <h2 className="text-[8.5px] font-extrabold text-navy">Kategori</h2>
          <div className="mt-1 flex gap-1 overflow-hidden">
            <ChipMini aktif>
              Semua{" "}
              <span className="rounded-full bg-white/15 px-1 text-[5.5px]">
                12
              </span>
            </ChipMini>
            <ChipMini>
              Nugget &amp; Sosis{" "}
              <span className="rounded-full bg-paper px-1 text-[5.5px] text-muted">
                4
              </span>
            </ChipMini>
            <ChipMini>
              Bakso{" "}
              <span className="rounded-full bg-paper px-1 text-[5.5px] text-muted">
                2
              </span>
            </ChipMini>
            <ChipMini>
              Kentang{" "}
              <span className="rounded-full bg-paper px-1 text-[5.5px] text-muted">
                2
              </span>
            </ChipMini>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <h2 className="text-[8.5px] font-extrabold text-navy">Produk</h2>
          <span className="text-[6px] font-bold text-brand">Lihat semua</span>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-1.5">
          {PRODUK.map((p) => (
            <ProdukMini key={p.nama} p={p} />
          ))}
        </div>
      </div>
    </AppMini>
  );
}

function LayarKatalog() {
  return (
    <AppMini aktif={1} isi={2}>
      <JudulHalaman
        judul="Katalog produk"
        teks="Semua frozen food yang tersedia di toko. Stok dan harga diperbarui langsung oleh admin."
      />

      <div className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-1.5 shadow-card">
        <div className="flex gap-1">
          <div className="relative min-w-0 flex-1">
            <Search
              size={9}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <div className="flex h-6 items-center rounded-md border border-line bg-white pl-5 pr-1.5 text-[6.5px] text-muted">
              Cari produk, kategori, atau kebutuhan…
            </div>
          </div>
          <span className="flex h-6 flex-none items-center rounded-md bg-brand px-2 text-[6.5px] font-bold text-white">
            Cari
          </span>
        </div>
        <div className="mt-1.5 flex gap-1 overflow-hidden">
          <ChipMini aktif>Semua</ChipMini>
          <ChipMini>Nugget &amp; Sosis</ChipMini>
          <ChipMini>Bakso</ChipMini>
          <ChipMini>Kentang</ChipMini>
        </div>
      </div>

      <div className="mx-2.5 mt-2 flex items-center justify-between">
        <p className="text-[6px] text-muted">
          <span className="stat-num font-bold text-navy">12</span> produk
          ditemukan
        </p>
        <span className="flex h-5 items-center gap-0.5 rounded-md border border-line bg-white px-1.5 text-[6px] font-semibold text-navy">
          Urutkan: Unggulan <ChevronDown size={7} />
        </span>
      </div>

      <div className="mx-2.5 mt-1.5 grid grid-cols-2 gap-1.5">
        {PRODUK.map((p) => (
          <ProdukMini key={p.nama} p={p} />
        ))}
      </div>
    </AppMini>
  );
}

function BarisKeranjang({
  nama,
  satuan,
  harga,
  jumlah,
  gambar,
}: {
  nama: string;
  satuan: string;
  harga: number;
  jumlah: number;
  gambar: string;
}) {
  return (
    <div className="flex gap-1.5 py-2">
      <div className="relative h-9 w-9 flex-none overflow-hidden rounded-md border border-line bg-mist">
        <Gambar
          src={gambar}
          alt={nama}
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p className="truncate text-[7.5px] font-bold text-navy">{nama}</p>
            <p className="text-[6px] text-muted">{satuan}</p>
          </div>
          <span className="flex h-4 w-4 flex-none items-center justify-center rounded text-muted">
            <Trash2 size={8} />
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-1 pt-1">
          <span className="flex items-center gap-0.5 rounded-md border border-brand/35 bg-mist p-0.5">
            <span className="flex h-4 w-4 items-center justify-center text-brand">
              <Minus size={7} strokeWidth={2.6} />
            </span>
            <span className="stat-num min-w-3 text-center text-[7px] font-extrabold text-navy">
              {jumlah}
            </span>
            <span className="flex h-4 w-4 items-center justify-center text-brand">
              <Plus size={7} strokeWidth={2.6} />
            </span>
          </span>
          <span className="stat-num text-[7.5px] font-extrabold text-navy">
            {rupiah(harga * jumlah)}
          </span>
        </div>
      </div>
    </div>
  );
}

function LayarKeranjang() {
  return (
    <AppMini aktif={2} isi={2}>
      <JudulHalaman
        judul="Keranjang belanja"
        teks="Periksa jumlah produk sebelum melanjutkan ke checkout."
      />

      <div className="mx-2.5 mt-1.5 overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-2 py-1.5">
          <p className="text-[8px] font-extrabold text-navy">
            Produk di keranjang{" "}
            <span className="ml-0.5 rounded-full bg-mist px-1 py-px text-[6px] text-brand">
              2
            </span>
          </p>
          <span className="text-[6px] font-semibold text-muted">
            Hapus semua
          </span>
        </div>
        <div className="divide-y divide-line px-2">
          <BarisKeranjang
            nama="Chicken Nugget"
            satuan="500 g"
            harga={27900}
            jumlah={1}
            gambar="/produk/nugget.jpg"
          />
          <BarisKeranjang
            nama="Bakso Sapi"
            satuan="500 g"
            harga={30000}
            jumlah={1}
            gambar="/produk/bakso.jpg"
          />
        </div>
      </div>

      <div className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2 shadow-card">
        <p className="text-[8px] font-extrabold text-navy">Ringkasan</p>
        <dl className="mt-1 space-y-1 text-[6.5px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal (2 produk)</dt>
            <dd className="stat-num font-bold text-navy">{rupiah(57900)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ongkir</dt>
            <dd className="font-semibold text-muted">Dihitung saat checkout</dd>
          </div>
        </dl>
        <div className="mt-1.5 rounded-md bg-paper p-1.5">
          <p className="flex items-center gap-1 text-[6px] font-semibold text-navy">
            <Truck size={8} className="flex-none text-brand" />
            Tambah <span className="text-brand">{rupiah(92100)}</span> lagi
            untuk gratis ongkir
          </p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#DCE9F6]">
            <div className="h-full w-[39%] rounded-full bg-brand" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between border-t border-line pt-1.5">
          <span className="text-[6.5px] font-bold text-navy">
            Total barang
          </span>
          <span className="stat-num text-[9.5px] font-extrabold text-navy">
            {rupiah(57900)}
          </span>
        </div>
        <div className="mt-1.5 flex min-h-[24px] items-center justify-center gap-1 rounded-md bg-brand text-[7px] font-bold text-white">
          Lanjut ke checkout <ArrowRight size={7} />
        </div>
        <div className="mt-1 flex min-h-[22px] items-center justify-center text-[6.5px] font-semibold text-navy">
          Lanjut belanja
        </div>
        <p className="mt-2 flex items-start gap-1 border-t border-line pt-1.5 text-[6px] leading-relaxed text-muted">
          <PackageOpen size={7} className="mt-px flex-none" />
          Keranjang tersimpan di perangkat ini. Harga final dicek ulang oleh
          sistem saat pesanan dibuat.
        </p>
      </div>
    </AppMini>
  );
}

function LayarData() {
  return (
    <AppMini aktif={2} isi={2}>
      <JudulHalaman
        judul="Checkout"
        teks="Satu halaman saja. Nama dan nomor HP dipakai admin untuk mengonfirmasi pesanan."
      />

      <div className="mx-2.5 mt-1.5 space-y-1.5">
        <SectionMini n={1} judul="Data pembeli">
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            <IsianMini
              label="Nama lengkap"
              nilai="Siti Aisyah"
              placeholder="Contoh: Siti Aisyah"
            />
            <IsianMini
              label="Nomor HP / WhatsApp"
              nilai="0812 3456 7890"
              placeholder="0812 3456 7890"
            />
          </div>
          <p className="mt-1 text-[5.5px] leading-snug text-muted">
            Nomor HP dipakai admin untuk mengonfirmasi pesanan.
          </p>
        </SectionMini>

        <SectionMini n={2} judul="Cara menerima">
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            <OpsiMini
              Ikon={Truck}
              judul="Antar ke rumah"
              teks={`Ongkir ${rupiah(12000)} · gratis di atas ${rupiah(150000)} · wajib QRIS/transfer`}
              aktif
            />
            <OpsiMini
              Ikon={Store}
              judul="Ambil di toko"
              teks="Gratis · bisa bayar tunai di kasir"
            />
          </div>

          <IsianMini
            label="Detail alamat"
            nilai="Pondok Pabean Indah Blok N No. 10, Dringu"
            placeholder="Nama jalan, nomor rumah, patokan…"
            area
          />
          <p className="mt-1 flex items-center gap-1 text-[5.5px] text-muted">
            <MapPin size={7} className="flex-none text-brand" />
            Kurir akan menghubungi nomor HP saat tiba.
          </p>

          <div className="mt-1.5 rounded-md border border-line bg-paper/60 p-1.5">
            <p className="flex items-center gap-1 text-[5.5px] font-bold uppercase tracking-[0.08em] text-muted">
              <MapPin size={7} className="text-brand" /> Titik lokasi antar ·
              wajib
            </p>
            <p className="mt-0.5 text-[5.5px] leading-snug text-muted">
              Tekan Pilih lokasi saya saat berada di rumah, lalu geser pin bila
              titiknya meleset.
            </p>
            <div className="mt-1">
              <PetaMini mode="pilih" />
            </div>
            <div className="mt-1 flex min-h-[24px] items-center justify-center gap-1 rounded-md bg-brand text-[7px] font-bold text-white">
              <Crosshair size={8} /> Pilih lokasi saya
            </div>
          </div>
        </SectionMini>
      </div>
    </AppMini>
  );
}

function LayarTitik() {
  return (
    <AppMini aktif={2} isi={2}>
      <JudulHalaman
        judul="Checkout"
        teks="Titik antar wajib diisi. Pembeli sendiri yang menentukan lokasi, bukan kurir."
      />

      <div className="mx-2.5 mt-1.5">
        <SectionMini n={2} judul="Cara menerima">
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            <OpsiMini
              Ikon={Truck}
              judul="Antar ke rumah"
              teks={`Ongkir ${rupiah(12000)} · wajib QRIS/transfer`}
              aktif
            />
            <OpsiMini
              Ikon={Store}
              judul="Ambil di toko"
              teks="Gratis · bisa bayar tunai di kasir"
            />
          </div>

          <IsianMini
            label="Detail alamat"
            nilai="Pondok Pabean Indah Blok N No. 10, Dringu, Kota Probolinggo"
            placeholder="Nama jalan, nomor rumah, patokan…"
            area
          />

          <div className="mt-1.5 rounded-md border border-line bg-paper/60 p-1.5">
            <p className="flex items-center gap-1 text-[5.5px] font-bold uppercase tracking-[0.08em] text-muted">
              <MapPin size={7} className="text-brand" /> Titik lokasi antar ·
              wajib
            </p>
            <p className="mt-0.5 text-[5.5px] leading-snug text-muted">
              Tekan Pilih lokasi saya saat berada di rumah. Kalau titiknya
              belum tepat, ketuk atau geser pin di peta.
            </p>
            <div className="mt-1">
              <PetaMini mode="pilih" />
            </div>
            <div className="mt-1 flex min-h-[24px] items-center justify-center gap-1 rounded-md bg-brand text-[7px] font-bold text-white">
              <Crosshair size={8} /> Pilih lokasi saya
            </div>
            <p className="mt-1 text-[5.5px] leading-snug text-muted">
              Titik dari GPS · akurasi ± 12 m. Geser pin bila perlu.
            </p>
          </div>

          <div className="mt-1.5 rounded-md border border-line bg-white px-2 py-1.5">
            <p className="text-[6px] font-bold text-navy">Jadwal (opsional)</p>
            <div className="mt-0.5 flex h-6 items-center justify-between rounded-md border border-line px-1.5">
              <span className="text-[6.5px] font-semibold text-navy">
                Secepatnya
              </span>
              <ChevronDown size={8} className="text-muted" />
            </div>
          </div>
        </SectionMini>
      </div>
    </AppMini>
  );
}

function LayarBayar() {
  return (
    <AppMini aktif={2} isi={2}>
      <JudulHalaman
        judul="Checkout"
        teks="Pilih pembayaran, lalu tekan Buat pesanan. Admin memverifikasi dulu."
      />

      <div className="mx-2.5 mt-1.5">
        <SectionMini n={3} judul="Pembayaran">
          <div className="mt-1 grid grid-cols-3 gap-1">
            <BayarMini
              Ikon={Banknote}
              judul="Tunai"
              teks="Hanya untuk ambil di toko"
              mati
            />
            <BayarMini
              Ikon={QrCode}
              judul="QRIS"
              teks="Scan, lalu bayar"
              aktif
            />
            <BayarMini
              Ikon={Landmark}
              judul="Transfer"
              teks="Transfer bank, lalu konfirmasi"
            />
          </div>

          <p className="mt-1.5 rounded-md bg-mist px-1.5 py-1 text-[5.5px] leading-snug text-navy/80">
            Pesanan antar wajib QRIS atau transfer. Admin memverifikasi
            pembayaran dulu, baru pesanan disiapkan dan diantar kurir.
          </p>

          <div className="mt-1.5 rounded-md border border-line bg-white px-1.5 py-1.5 text-center">
            <QrMini />
            <p className="mt-0.5 text-[7px] font-extrabold text-navy">
              Yanti Frozen
            </p>
            <p className="text-[5.5px] leading-snug text-muted">
              Scan dengan aplikasi bank atau e-wallet, lalu bayar{" "}
              <strong className="font-bold text-navy">{rupiah(69900)}</strong>.
            </p>
          </div>
        </SectionMini>
      </div>

      <div className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2 shadow-card">
        <p className="text-[8px] font-extrabold text-navy">
          Ringkasan pesanan
        </p>
        <dl className="mt-1 space-y-0.5 text-[6.5px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="stat-num font-semibold text-navy">
              {rupiah(57900)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ongkir</dt>
            <dd className="stat-num font-semibold text-navy">
              {rupiah(12000)}
            </dd>
          </div>
        </dl>
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1">
          <span className="text-[6.5px] font-bold text-navy">Total bayar</span>
          <span className="stat-num text-[9.5px] font-extrabold text-navy">
            {rupiah(69900)}
          </span>
        </div>
        <div className="mt-1.5 flex min-h-[24px] items-center justify-center gap-1 rounded-md bg-brand text-[7px] font-bold text-white">
          <Lock size={8} /> Buat pesanan
        </div>
        <p className="mt-1 flex items-center justify-center gap-1 text-[5.5px] text-muted">
          <Clock size={7} /> Dikonfirmasi admin pada jam operasional
        </p>
      </div>
    </AppMini>
  );
}

function BantuanMini() {
  return (
    <section className="mx-2.5 mt-1.5 rounded-lg bg-navy p-2 text-white">
      <p className="text-[7.5px] font-extrabold">Butuh bantuan?</p>
      <p className="mt-0.5 text-[5.5px] leading-snug text-white/65">
        Admin siap membantu setiap hari 08.00 – 21.00.
      </p>
      <div className="mt-1.5 flex gap-1">
        <span className="flex min-h-[22px] flex-1 items-center justify-center gap-0.5 rounded-md bg-white text-[6px] font-bold text-navy">
          <WhatsAppIcon size={7} /> WhatsApp
        </span>
        <span className="flex min-h-[22px] flex-1 items-center justify-center gap-0.5 rounded-md border border-white/20 bg-white/10 text-[6px] font-bold text-white">
          Riwayat pesanan <ArrowRight size={7} />
        </span>
      </div>
    </section>
  );
}

function LayarKurir() {
  return (
    <AppMini aktif={4} isi={2}>
      <div className="flex items-start justify-between gap-2 px-2.5 pt-1.5">
        <div className="min-w-0">
          <p className="text-[5.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Status pesanan
          </p>
          <h3 className="text-[11px] font-extrabold leading-tight text-navy">
            YF261114-4821
          </h3>
          <p className="text-[5px] text-muted">
            Dibuat 14 Nov, 08.40 · atas nama Siti Aisyah
          </p>
        </div>
        <span className="rounded-full border border-[#C9E1F7] bg-mist px-1.5 py-0.5 text-[6px] font-bold text-brand">
          Diantar
        </span>
      </div>

      <section className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-extrabold text-navy">Pelacakan kurir</p>
          <span className="flex items-center gap-0.5 text-[5.5px] font-bold text-leaf">
            <span className="live-dot h-1 w-1 rounded-full bg-leaf" /> GPS aktif
          </span>
        </div>

        <div className="mt-1">
          <PetaMini mode="kurir" />
        </div>

        <div className="mt-1 flex items-center gap-1.5 rounded-md border border-line p-1.5">
          <AvatarPeran peran="kurir" ukuran={22} className="ring-1 ring-line" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[7px] font-bold text-navy">
              Ahmad Fauzi
              <span className="inline-flex items-center gap-0.5 text-[5.5px] font-semibold text-[#8A520B]">
                <Star size={5} fill="currentColor" /> 4.9
              </span>
            </p>
            <p className="flex items-center gap-1 text-[5.5px] text-muted">
              <Bike size={6} /> Honda Vario · N 1234 AB
            </p>
            <p className="text-[5px] text-muted">
              Lokasi GPS aktif · baru saja
            </p>
          </div>
          <span className="flex h-5 flex-none items-center gap-0.5 rounded-md border border-line px-1 text-[5.5px] font-bold text-brand">
            <Phone size={6} /> Hubungi
          </span>
        </div>

        <div className="mt-1 flex items-start gap-1 rounded-md bg-paper px-1.5 py-1">
          <MapPin size={7} className="mt-0.5 flex-none text-brand" />
          <p className="text-[5.5px] leading-snug text-muted">
            Pondok Pabean Indah Blok N No. 10, Dringu, Kota Probolinggo
          </p>
        </div>
      </section>

      <section className="mx-2.5 mt-1.5">
        <TimelineMini aktif={3} />
      </section>

      <section className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2">
        <p className="text-[8px] font-extrabold text-navy">Rincian pesanan</p>
        {[
          { nama: "Chicken Nugget", satuan: "500 g", harga: 27900, gambar: "/produk/nugget.jpg" },
          { nama: "Bakso Sapi", satuan: "500 g", harga: 30000, gambar: "/produk/bakso.jpg" },
        ].map((p) => (
          <div key={p.nama} className="mt-1 flex items-center gap-1.5">
            <span className="relative h-5 w-5 flex-none overflow-hidden rounded border border-line bg-mist">
              <Gambar src={p.gambar} alt="" fill sizes="20px" className="object-cover" />
              <span className="absolute bottom-0 right-0 rounded-tl bg-navy/85 px-0.5 text-[4.5px] font-bold leading-[1.4] text-white">
                1×
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[6.5px] font-semibold leading-tight text-navy">
                {p.nama}
              </p>
              <p className="text-[5px] leading-tight text-muted">
                1 × {rupiah(p.harga)} · {p.satuan}
              </p>
            </div>
            <p className="text-[6.5px] font-bold text-navy">{rupiah(p.harga)}</p>
          </div>
        ))}
        <dl className="mt-1 space-y-0.5 border-t border-line pt-1 text-[5.5px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold text-navy">{rupiah(57900)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ongkir (antar kurir)</dt>
            <dd className="font-semibold text-navy">{rupiah(12000)}</dd>
          </div>
        </dl>
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1">
          <span className="text-[6.5px] font-bold text-navy">Total bayar</span>
          <span className="stat-num text-[8px] font-extrabold text-navy">
            {rupiah(69900)}
          </span>
        </div>
      </section>
    </AppMini>
  );
}

function LayarSelesai() {
  return (
    <AppMini aktif={4} isi={0}>
      <div className="flex items-start justify-between gap-2 px-2.5 pt-1.5">
        <div className="min-w-0">
          <p className="text-[5.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Status pesanan
          </p>
          <h3 className="text-[11px] font-extrabold leading-tight text-navy">
            YF261114-4821
          </h3>
          <p className="text-[5px] text-muted">
            Dibuat 14 Nov, 08.40 · atas nama Siti Aisyah
          </p>
        </div>
        <span className="rounded-full border border-[#C6E7DA] bg-leaf-soft px-1.5 py-0.5 text-[6px] font-bold text-leaf">
          Selesai
        </span>
      </div>

      <section className="mx-2.5 mt-1.5">
        <TimelineMini aktif={4} selesai />
      </section>

      <section className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2">
        <p className="text-[8px] font-extrabold text-navy">
          Terima kasih atas ulasan Anda
        </p>
        <p className="mt-0.5 text-[5.5px] leading-snug text-muted">
          Bintang dan ulasan Anda sudah masuk ke laporan admin toko.
        </p>
        <div className="mt-1.5 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={12}
              className="text-[#F2A03A]"
              fill="currentColor"
            />
          ))}
          <span className="ml-1 text-[6.5px] font-bold text-navy">
            5 dari 5
          </span>
        </div>
        <p className="mt-1 rounded-md bg-paper px-1.5 py-1 text-[6px] leading-snug text-navy/80">
          Barang masih beku, kurir cepat dan ramah.
        </p>
      </section>

      <section className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-extrabold text-navy">Pembayaran</p>
          <span className="rounded-full border border-[#C6E7DA] bg-leaf-soft px-1.5 py-0.5 text-[5.5px] font-bold text-leaf">
            Lunas
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 rounded-md bg-paper px-1.5 py-1">
          <QrCode size={9} className="text-brand" />
          <span className="text-[6.5px] font-semibold text-navy">QRIS</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-[5.5px] font-bold uppercase tracking-wide text-muted">
            Total tagihan
          </span>
          <span className="stat-num text-[9px] font-extrabold text-navy">
            {rupiah(69900)}
          </span>
        </div>
        <p className="mt-1 flex items-start gap-1 rounded-md bg-leaf-soft px-1.5 py-1 text-[5.5px] leading-snug text-leaf">
          <Check size={7} className="mt-0.5 flex-none" />
          Pembayaran sudah dikonfirmasi admin. Terima kasih.
        </p>
      </section>

      <div className="mx-2.5 mt-1.5 rounded-lg border border-line bg-white p-2">
        <p className="flex items-center gap-1 text-[5.5px] font-bold uppercase tracking-[0.08em] text-muted">
          <Camera size={7} /> Foto bukti penerimaan
        </p>
        <div className="mt-1 flex h-10 items-center justify-center gap-1 rounded-md border border-dashed border-[#B9D6EE] bg-mist/60 text-[6px] font-semibold text-muted">
          <Camera size={9} className="text-brand/60" /> Foto dari kurir tampil
          di sini
        </div>
      </div>

      <BantuanMini />
    </AppMini>
  );
}

const LAYAR: ComponentType[] = [
  LayarBeranda,
  LayarKatalog,
  LayarKeranjang,
  LayarData,
  LayarTitik,
  LayarBayar,
  LayarKurir,
  LayarSelesai,
];

export function CaraPesanDemo() {
  const [tahap, setTahap] = useState(0);
  const terakhir = tahap === TAHAP.length - 1;
  const info = TAHAP[tahap];
  const Layar = LAYAR[tahap];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 pt-3.5 md:px-5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
          <BookOpenText size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-extrabold text-navy">
            Contoh cara pesan
          </p>
          <p className="text-[11.5px] leading-snug text-muted">
            Ikuti dengan panah Kembali dan Selanjutnya. Tidak berjalan sendiri.
            Data contoh, bukan pesanan asli.
          </p>
        </div>
      </div>

      <div className="mt-3 bg-[linear-gradient(165deg,#123f6d,#0a1f36)] px-3 py-3 md:px-4">
        <div className="mx-auto h-[560px] max-w-[400px] overflow-hidden rounded-[20px] bg-paper text-navy shadow-[0_18px_40px_-24px_rgba(4,16,30,0.85)]">
          <div key={info.id} className="rise h-full">
            <Layar />
          </div>
        </div>

        <div className="mx-auto mt-3 max-w-[400px]">
          <div className="flex items-baseline justify-between gap-2">
            <p className="flex-none text-[10px] font-extrabold uppercase tracking-[0.12em] text-sky">
              Langkah {tahap + 1} dari {TAHAP.length}
            </p>
            <p className="min-w-0 truncate text-right text-[12px] font-extrabold text-white">
              {info.judul}
            </p>
          </div>
          <p
            aria-live="polite"
            className="mt-0.5 min-h-[32px] text-[11px] leading-relaxed text-white/65"
          >
            {info.ket}
          </p>

          <div className="mt-1 flex gap-1" aria-hidden="true">
            {TAHAP.map((t, i) => (
              <span
                key={t.id}
                className={`h-1 flex-1 rounded-full ${
                  i <= tahap ? "bg-sky" : "bg-white/15"
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setTahap((t) => Math.max(0, t - 1))}
              disabled={tahap === 0}
              className="btn flex-1 border border-white/20 bg-white/10 px-3 text-[13px] text-white hover:bg-white/15 sm:flex-none"
            >
              <ArrowLeft size={15} /> Kembali
            </button>

            {terakhir ? (
              <button
                type="button"
                onClick={() => setTahap(0)}
                aria-label="Ulangi contoh dari awal"
                className="btn btn-primary flex-1 px-3 text-[13px] sm:flex-none"
              >
                <RotateCcw size={15} /> Ulangi
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setTahap((t) => Math.min(TAHAP.length - 1, t + 1))
                }
                className="btn btn-primary flex-1 px-3 text-[13px] sm:flex-none"
              >
                Selanjutnya <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

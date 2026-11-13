"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, History, Loader2, Phone } from "lucide-react";
import { OrderStatusBadge } from "./status-badge";
import {
  KUNCI_PESANAN,
  bacaKodePesanan,
  bacaTelepon,
  hapusKodePesanan,
  hapusTelepon,
  simpanKodePesanan,
  simpanTelepon,
} from "@/lib/order-history";
import { relatif, rupiah, tanggal } from "@/lib/format";
import type { Order, OrderItem } from "@/lib/types";

type KurirRingkas = { nama: string } | null;

type Pesanan = {
  order: Order;
  items: OrderItem[];
  kurir: KurirRingkas;
};

const SELESAI = new Set(["selesai", "batal"]);

async function ambilPesanan(kode: string): Promise<Pesanan | null> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(kode)}`, {
      cache: "no-store",
    });
    if (res.status === 404) {
      hapusKodePesanan(kode);
      return null;
    }
    if (!res.ok) return null;
    const json = await res.json();
    return { order: json.order, items: json.items, kurir: json.kurir };
  } catch {
    return null;
  }
}

function KartuPesanan({
  pesanan,
  aktif,
}: {
  pesanan: Pesanan;
  aktif: boolean;
}) {
  const { order, items, kurir } = pesanan;
  const jumlah = items.reduce((a, b) => a + b.jumlah, 0);

  return (
    <Link
      href={`/pesanan/${encodeURIComponent(order.kode)}`}
      className="lift press flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-4"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="stat-num text-[12.5px] font-extrabold text-navy">
            {order.kode}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className="mt-1.5 text-[12px] text-muted">
          {tanggal(order.dibuat)} · {jumlah} produk ·{" "}
          {order.metode === "antar" ? "Diantar" : "Ambil di toko"}
        </p>

        <p className="mt-1 text-[14px] font-extrabold text-navy">
          {rupiah(order.total)}
        </p>

        {aktif && (
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            {order.status === "diantar" && kurir
              ? `Kurir ${kurir.nama} sedang mengantar.`
              : order.status === "siap"
                ? "Pesanan sudah siap diambil di toko."
                : "Status diperbarui otomatis oleh admin."}
          </p>
        )}

        <span className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-brand">
          {aktif ? "Lacak pesanan" : "Lihat rincian"}
          <ChevronRight size={14} />
        </span>
      </div>

      {aktif && (
        <span className="mt-1 text-right text-[11px] leading-snug text-muted">
          Diperbarui
          <span className="block">{relatif(order.diperbarui)}</span>
        </span>
      )}
    </Link>
  );
}

export function OrderHistory() {
  const [daftar, setDaftar] = useState<Pesanan[] | null>(null);
  const [nomor, setNomor] = useState("");
  const [formNomor, setFormNomor] = useState("");
  const [ubahNomor, setUbahNomor] = useState(false);
  const [mencari, setMencari] = useState(false);
  const [catatan, setCatatan] = useState("");
  const nomorAktif = useRef("");
  const versi = useRef(0);

  const muat = useCallback(async (hp: string, cariNomor: boolean) => {
    const urut = ++versi.current;
    if (cariNomor) setMencari(true);
    let pesan = "";

    // Detail pesanan yang sudah tersimpan diambil bersamaan dengan pemeriksaan
    // nomor, supaya daftar tidak menunggu dua kali lipat.
    const awal = new Map(
      bacaKodePesanan().map((c) => [c.kode, ambilPesanan(c.kode)]),
    );

    if (cariNomor && hp) {
      try {
        const res = await fetch(
          `/api/pesanan-saya?hp=${encodeURIComponent(hp)}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.kode)) {
            for (const k of json.kode) {
              if (typeof k === "string") simpanKodePesanan(k);
            }
          }
        } else if (res.status === 429) {
          pesan = "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
        }
      } catch {
        pesan = "Perangkat ini belum bisa memeriksa pesanan. Periksa koneksi lalu coba lagi.";
      }
    }

    const kode = bacaKodePesanan();
    const hasil = await Promise.all(
      kode.map((c) => awal.get(c.kode) ?? ambilPesanan(c.kode)),
    );
    if (urut !== versi.current) return;

    setDaftar(hasil.filter((x): x is Pesanan => Boolean(x)));
    setCatatan(pesan);
    setMencari(false);
  }, []);

  useEffect(() => {
    const awal = bacaTelepon();
    nomorAktif.current = awal;
    setNomor(awal);
    setFormNomor(awal);
    muat(awal, Boolean(awal));

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible")
        muat(nomorAktif.current, false);
    }, 20_000);
    const saatFokus = () => muat(nomorAktif.current, false);
    const saatSimpan = (e: StorageEvent) => {
      if (e.key === KUNCI_PESANAN) muat(nomorAktif.current, false);
    };
    window.addEventListener("focus", saatFokus);
    window.addEventListener("storage", saatSimpan);
    return () => {
      versi.current += 1;
      window.clearInterval(timer);
      window.removeEventListener("focus", saatFokus);
      window.removeEventListener("storage", saatSimpan);
    };
  }, [muat]);

  function cekNomor(e: React.FormEvent) {
    e.preventDefault();
    const digit = formNomor.replace(/\D/g, "");
    if (digit.length < 10 || digit.length > 15) {
      setCatatan("Nomor HP tidak valid. Contoh: 0898 0440 095.");
      return;
    }
    simpanTelepon(digit);
    nomorAktif.current = digit;
    setNomor(digit);
    setFormNomor(digit);
    setUbahNomor(false);
    setCatatan("");
    muat(digit, true);
  }

  function lupakanNomor() {
    hapusTelepon();
    nomorAktif.current = "";
    setNomor("");
    setFormNomor("");
    setCatatan("");
    setUbahNomor(false);
    muat("", false);
  }

  if (daftar === null) {
    return (
      <p className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-muted">
        <Loader2 size={14} className="animate-spin" />
        Memuat riwayat pesanan…
      </p>
    );
  }

  const formulir = (
    <form onSubmit={cekNomor} className="mt-4 text-left">
      <label htmlFor="nomor-hp" className="label">
        Nomor HP saat pesan
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Phone
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="nomor-hp"
            type="tel"
            inputMode="tel"
            value={formNomor}
            onChange={(e) => setFormNomor(e.target.value)}
            placeholder="0898 0440 095"
            autoComplete="tel"
            className="field pl-10"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary sm:px-5" disabled={mencari}>
          {mencari ? <Loader2 size={16} className="animate-spin" /> : null}
          Cari pesanan
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4">
        {nomor && (
          <button
            type="button"
            onClick={lupakanNomor}
            className="inline-flex min-h-11 items-center text-[11.5px] font-semibold text-muted underline underline-offset-2 hover:text-navy"
          >
            Hapus nomor dari perangkat ini
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setUbahNomor(false);
            setCatatan("");
          }}
          className="inline-flex min-h-11 items-center text-[11.5px] font-semibold text-brand"
        >
          Batal
        </button>
      </div>
    </form>
  );

  if (!daftar.length) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-line bg-white px-5 py-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-brand">
          <History size={22} />
        </span>
        <p className="mt-3 text-[15px] font-extrabold text-navy">
          {mencari
            ? "Memeriksa pesanan…"
            : nomor
              ? "Tidak ada pesanan yang tercatat"
              : "Belum ada pesanan di perangkat ini"}
        </p>
        {!mencari && (
          <p className="mx-auto mt-1 max-w-[340px] text-[13px] leading-relaxed text-muted">
            {nomor
              ? "Pesanan baru dari perangkat ini akan muncul otomatis di sini."
              : "Setelah Anda pesan dari HP ini, pesanan dan status kurirnya muncul otomatis tanpa kode."}
          </p>
        )}

        {!mencari && !ubahNomor && (
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <Link href="/katalog" className="btn btn-primary">
              Buka katalog
            </Link>
            <button
              type="button"
              onClick={() => setUbahNomor(true)}
              className="inline-flex min-h-11 items-center px-2 text-[12px] font-semibold text-brand"
            >
              Pesanan dari nomor lain? Cek di sini
            </button>
          </div>
        )}

        {ubahNomor && formulir}

        {catatan && (
          <p className="mx-auto mt-3 max-w-[340px] text-[12px] leading-relaxed text-[#8A520B]">
            {catatan}
          </p>
        )}
      </div>
    );
  }

  const urut = [...daftar].sort((a, b) =>
    a.order.dibuat < b.order.dibuat ? 1 : -1,
  );
  const aktif = urut.filter((p) => !SELESAI.has(p.order.status));
  const selesai = urut.filter((p) => SELESAI.has(p.order.status));

  return (
    <div className="mt-5 space-y-7">
      {ubahNomor && formulir}

      {catatan && (
        <p className="text-[12px] leading-relaxed text-[#8A520B]">{catatan}</p>
      )}

      {aktif.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-[15px] font-extrabold text-navy">
              Sedang berjalan
            </h2>
            <span className="text-[11.5px] font-semibold text-muted">
              {aktif.length} pesanan
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            Status dan posisi kurir ikut diperbarui otomatis.
          </p>
          <div className="mt-3 space-y-2.5">
            {aktif.map((p) => (
              <KartuPesanan key={p.order.kode} pesanan={p} aktif />
            ))}
          </div>
        </section>
      )}

      {selesai.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-[15px] font-extrabold text-navy">
              Sudah selesai
            </h2>
            <span className="text-[11.5px] font-semibold text-muted">
              {selesai.length} pesanan
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            {selesai.map((p) => (
              <KartuPesanan key={p.order.kode} pesanan={p} aktif={false} />
            ))}
          </div>
        </section>
      )}

      {!ubahNomor && (
        <button
          type="button"
          onClick={() => setUbahNomor(true)}
          className="inline-flex min-h-11 items-center text-[11.5px] font-semibold text-muted underline underline-offset-2 hover:text-navy"
        >
          Cek pesanan dari nomor lain
        </button>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageOpen, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { QtyStepper } from "@/components/qty-stepper";
import { rupiah } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function CartView({ settings }: { settings: Settings }) {
  const { items, ready, subtotal, setJumlah, remove, clear } = useCart();
  const [konfirmasi, setKonfirmasi] = useState(false);
  const count = items.reduce((a, b) => a + b.jumlah, 0);
  const kurang = Math.max(0, settings.gratisOngkirMin - subtotal);
  const progress = Math.min(100, (subtotal / settings.gratisOngkirMin) * 100);

  if (!ready) {
    return (
      <div className="mt-6 animate-pulse space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/70" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mt-6 flex flex-col items-center rounded-[22px] border border-dashed border-[#C9E1F7] bg-white px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mist text-brand">
          <ShoppingBag size={28} strokeWidth={1.8} />
        </span>
        <h2 className="mt-4 text-[19px] font-extrabold text-navy">
          Keranjang masih kosong
        </h2>
        <p className="mt-1.5 max-w-[340px] text-[13px] leading-relaxed text-muted">
          Yuk mulai dari produk favorit keluarga. Semua produk beku dan siap
          dimasak kapan saja.
        </p>
        <Link href="/katalog" className="btn btn-primary mt-5">
          Mulai belanja <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-start">
      <div className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
          <h2 className="text-[14px] font-extrabold text-navy">
            Produk di keranjang{" "}
            <span className="ml-1 rounded-full bg-mist px-2 py-0.5 text-[11px] text-brand">
              {count}
            </span>
          </h2>
          {konfirmasi ? (
            <span className="flex items-center gap-2 text-[11.5px]">
              <span className="text-muted">Hapus semua?</span>
              <button
                type="button"
                className="font-bold text-[#A3352C]"
                onClick={() => {
                  clear();
                  setKonfirmasi(false);
                }}
              >
                Ya
              </button>
              <button
                type="button"
                className="font-semibold text-muted"
                onClick={() => setKonfirmasi(false)}
              >
                Batal
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setKonfirmasi(true)}
              className="text-[11.5px] font-semibold text-muted hover:text-[#A3352C]"
            >
              Hapus semua
            </button>
          )}
        </div>

        <ul className="divide-y divide-line px-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-4">
              <Link
                href={`/produk/${item.slug}`}
                className="relative h-[76px] w-[76px] flex-none overflow-hidden rounded-xl border border-line bg-mist sm:h-[88px] sm:w-[88px]"
              >
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/produk/${item.slug}`}
                      className="line-clamp-2 text-[13.5px] font-bold leading-snug text-navy hover:text-brand"
                    >
                      {item.nama}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-muted">{item.satuan}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Hapus ${item.nama} dari keranjang`}
                    className="-mr-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg text-muted hover:bg-[#FDECEC] hover:text-[#A3352C]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                  <QtyStepper
                    value={item.jumlah}
                    onChange={(n) => setJumlah(item.id, n)}
                    small
                    max={Math.max(item.stok, 1)}
                  />
                  <div className="text-right">
                    <p className="stat-num text-[14px] font-extrabold text-navy">
                      {rupiah(item.harga * item.jumlah)}
                    </p>
                    <p className="stat-num text-[10.5px] text-muted">
                      {rupiah(item.harga)} / item
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-[120px]">
        <div className="rounded-[18px] border border-line bg-white p-4 shadow-card">
          <h2 className="text-[14px] font-extrabold text-navy">Ringkasan</h2>

          <dl className="mt-3 space-y-2.5 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal ({count} produk)</dt>
              <dd className="stat-num font-bold text-navy">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Ongkir</dt>
              <dd className="text-[12px] font-semibold text-muted">
                Dihitung saat checkout
              </dd>
            </div>
          </dl>

          <div className="mt-3 rounded-xl bg-paper p-3">
            <div className="flex items-center gap-2 text-[11.5px] font-semibold text-navy">
              <Truck size={14} className="text-brand" />
              {kurang > 0 ? (
                <span>
                  Tambah <span className="text-brand">{rupiah(kurang)}</span> lagi
                  untuk gratis ongkir
                </span>
              ) : (
                <span className="text-leaf">Selamat, pesanan Anda gratis ongkir!</span>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DCE9F6]">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-[13px] font-bold text-navy">Total barang</span>
            <span className="stat-num text-[20px] font-extrabold text-navy">
              {rupiah(subtotal)}
            </span>
          </div>

          <Link href="/checkout" className="btn btn-primary mt-4 w-full">
            Lanjut ke checkout <ArrowRight size={16} />
          </Link>
          <Link href="/katalog" className="btn btn-ghost mt-1.5 w-full text-[13px]">
            Lanjut belanja
          </Link>

          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
            <PackageOpen size={13} className="mt-0.5 flex-none" />
            Keranjang tersimpan di perangkat ini. Harga final dicek ulang oleh
            sistem saat pesanan dibuat.
          </p>
        </div>
      </aside>
    </div>
  );
}

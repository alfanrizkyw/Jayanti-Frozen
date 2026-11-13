"use client";

import { Minus, Plus } from "lucide-react";
import { useCart } from "./cart-provider";
import type { Product } from "@/lib/types";

export function AddToCart({
  product,
  jumlah = 1,
  className = "",
  label = "Tambah",
}: {
  product: Product;
  jumlah?: number;
  className?: string;
  label?: string;
}) {
  const { items, add, setJumlah, remove } = useCart();
  const line = items.find((i) => i.id === product.id);
  const qty = line?.jumlah ?? 0;
  const habis = product.stok <= 0;

  if (habis) {
    return (
      <div
        className={`btn btn-sm w-full cursor-not-allowed bg-[#EEF2F7] text-muted ${className}`}
        aria-label={`${product.nama} stok habis`}
      >
        Stok habis
      </div>
    );
  }

  if (qty > 0) {
    return (
      <div className={className}>
        <div className="flex items-center gap-1 rounded-xl border border-brand/35 bg-mist p-0.5">
          <button
            type="button"
            onClick={() =>
              qty <= 1 ? remove(product.id) : setJumlah(product.id, qty - 1)
            }
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-brand hover:bg-white"
            aria-label={
              qty <= 1
                ? `Hapus ${product.nama} dari keranjang`
                : `Kurangi ${product.nama}`
            }
          >
            <Minus size={16} strokeWidth={2.6} />
          </button>
          <span className="stat-num min-w-0 flex-1 text-center text-[14px] font-extrabold text-navy">
            {qty}
          </span>
          <button
            type="button"
            onClick={(e) => add(product, 1, e.currentTarget)}
            disabled={qty >= product.stok}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-brand hover:bg-white disabled:opacity-40"
            aria-label={`Tambah ${product.nama}`}
          >
            <Plus size={16} strokeWidth={2.6} />
          </button>
        </div>
        <p className="mt-1 text-center text-[10px] font-bold text-brand">
          Ada di keranjang
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => add(product, jumlah, e.currentTarget)}
      className={`btn btn-sm w-full border border-[#C9E1F7] bg-mist text-brand hover:border-brand hover:bg-[#DCEEFF] ${className}`}
      aria-label={`Tambah ${product.nama} ke keranjang`}
    >
      <Plus size={15} strokeWidth={2.6} />
      {label}
    </button>
  );
}

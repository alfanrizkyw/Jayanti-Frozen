"use client";

import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-provider";
import { QtyStepper } from "./qty-stepper";
import { rupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [jumlah, setJumlah] = useState(1);
  const harga = product.hargaPromo ?? product.harga;
  const habis = product.stok <= 0;

  return (
    <div className="rounded-[16px] border border-line bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            Subtotal
          </p>
          <p className="stat-num mt-0.5 text-[24px] font-extrabold text-navy">
            {rupiah(harga * jumlah)}
          </p>
        </div>
        <QtyStepper
          value={jumlah}
          onChange={setJumlah}
          min={1}
          max={Math.max(product.stok, 1)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={habis}
          onClick={(e) => add(product, jumlah, e.currentTarget)}
          className="btn btn-primary flex-1"
        >
          <ShoppingBag size={17} /> Tambah ke keranjang
        </button>
        <button
          type="button"
          disabled={habis}
          onClick={() => {
            add(product, jumlah);
            router.push("/checkout");
          }}
          className="btn btn-outline flex-1"
        >
          <Zap size={16} /> Beli sekarang
        </button>
      </div>

      {product.stok > 0 && product.stok <= 5 && (
        <p className="mt-3 text-center text-[11.5px] font-semibold text-[#8A520B]">
          Tersisa {product.stok} — segera pesan sebelum habis
        </p>
      )}
      {habis && (
        <p className="mt-3 text-center text-[11.5px] font-semibold text-muted">
          Produk sedang kosong. Hubungi toko untuk ketersediaan berikutnya.
        </p>
      )}
    </div>
  );
}

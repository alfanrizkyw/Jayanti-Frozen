"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function MiniCart() {
  const { count, subtotal, ready } = useCart();
  const pathname = usePathname();

  if (!ready || count === 0) return null;
  if (pathname.startsWith("/keranjang") || pathname.startsWith("/checkout")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 hidden px-6 md:block">
      <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-navy/10 bg-navy px-3 py-2.5 text-white shadow-lift">
        <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-sky">
          <ShoppingBag size={18} />
          <span className="stat-num absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-leaf px-1 text-[10px] font-extrabold text-white">
            {count}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-sky">
            Keranjang
          </p>
          <p className="stat-num truncate text-[14px] font-extrabold">
            {count} item · Rp {subtotal.toLocaleString("id-ID")}
          </p>
        </div>
        <Link
          href="/keranjang"
          className="btn btn-sm flex-none border border-white/25 bg-white text-navy hover:bg-mist"
        >
          Lihat keranjang <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

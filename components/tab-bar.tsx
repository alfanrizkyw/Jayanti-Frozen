"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, House, LayoutGrid, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

const tabs = [
  {
    href: "/",
    label: "Beranda",
    Ikon: House,
    cocok: (p: string) => p === "/",
  },
  {
    href: "/katalog",
    label: "Katalog",
    Ikon: LayoutGrid,
    cocok: (p: string) => p.startsWith("/katalog") || p.startsWith("/produk"),
  },
  {
    href: "/lacak",
    label: "Riwayat",
    Ikon: History,
    aria: "Riwayat pesanan",
    cocok: (p: string) => p.startsWith("/lacak") || p.startsWith("/pesanan"),
  },
  {
    href: "/keranjang",
    label: "Keranjang",
    Ikon: ShoppingBag,
    cocok: (p: string) =>
      p.startsWith("/keranjang") || p.startsWith("/checkout"),
  },
];

export function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();
  const aktifIndex = tabs.findIndex((tab) => tab.cocok(pathname));

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-paper/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="relative grid grid-cols-4 px-2 pb-1.5 pt-1.5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1.5 left-2 w-[calc((100%-16px)/4)] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateX(${Math.max(aktifIndex, 0) * 100}%)`,
            opacity: aktifIndex < 0 ? 0 : 1,
          }}
        >
          <span className="tab-pill block h-full rounded-xl bg-mist ring-1 ring-line" />
        </span>

        {tabs.map((tab) => {
          const aktif = tab.cocok(pathname);
          const Ikon = tab.Ikon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={aktif ? "page" : undefined}
              aria-label={tab.aria}
              className={`press relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 pb-1 pt-1.5 text-[11px] font-bold transition-colors duration-200 motion-reduce:transition-none ${
                aktif ? "text-brand" : "text-navy/65"
              }`}
            >
              <span className="relative">
                <Ikon size={21} strokeWidth={2.1} />
                {tab.href === "/keranjang" && count > 0 && (
                  <span
                    key={count}
                    className="stat-num absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white [animation:cart-pop_.32s_ease]"
                  >
                    {count}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

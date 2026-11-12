"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, PackageSearch, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

const tabs = [
  {
    href: "/",
    label: "Beranda",
    icon: House,
    cocok: (p: string) => p === "/",
  },
  {
    href: "/katalog",
    label: "Katalog",
    icon: LayoutGrid,
    cocok: (p: string) => p.startsWith("/katalog") || p.startsWith("/produk"),
  },
  {
    href: "/lacak",
    label: "Lacak",
    icon: PackageSearch,
    cocok: (p: string) => p.startsWith("/lacak") || p.startsWith("/pesanan"),
  },
  {
    href: "/keranjang",
    label: "Keranjang",
    icon: ShoppingBag,
    cocok: (p: string) =>
      p.startsWith("/keranjang") || p.startsWith("/checkout"),
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const aktifIndex = tabs.findIndex((tab) => tab.cocok(pathname));

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="relative mx-auto grid h-[64px] max-w-lg grid-cols-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1.5 left-0 w-1/4 px-2 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateX(${Math.max(aktifIndex, 0) * 100}%)`,
            opacity: aktifIndex < 0 ? 0 : 1,
          }}
        >
          <span className="block h-full rounded-2xl bg-mist" />
        </span>

        {tabs.map((tab) => {
          const active = tab.cocok(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 text-[11.5px] font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                active ? "text-brand" : "text-muted hover:text-navy"
              }`}
            >
              <span
                className={`relative transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  active ? "-translate-y-0.5 scale-105" : ""
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.3 : 1.9} />
                {tab.href === "/keranjang" && count > 0 && (
                  <span className="stat-num absolute -right-2.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand px-1 text-[9.5px] font-bold text-white">
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

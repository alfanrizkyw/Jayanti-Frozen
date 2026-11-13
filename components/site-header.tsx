"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "./cart-provider";
import { PreferencesControls } from "./preferences-controls";

const tabs = [
  {
    href: "/",
    label: "Beranda",
    cocok: (p: string) => p === "/",
  },
  {
    href: "/katalog",
    label: "Katalog",
    cocok: (p: string) => p.startsWith("/katalog") || p.startsWith("/produk"),
  },
  {
    href: "/lacak",
    label: "Riwayat",
    aria: "Riwayat pesanan",
    cocok: (p: string) => p.startsWith("/lacak") || p.startsWith("/pesanan"),
  },
  {
    href: "/keranjang",
    label: "Keranjang",
    cocok: (p: string) =>
      p.startsWith("/keranjang") || p.startsWith("/checkout"),
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const aktifIndex = tabs.findIndex((tab) => tab.cocok(pathname));

  return (
    <div className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <header className="container-page">
        <div className="flex h-14 items-center gap-2 md:h-[72px] md:gap-3">
          <Link
            href="/"
            aria-label="Yanti Frozen, ke beranda"
            className="flex-none rounded-lg py-1"
          >
            <Logo />
          </Link>

          <nav
            className="hidden items-center gap-0.5 md:ml-2 md:flex lg:ml-4 lg:gap-1"
            aria-label="Navigasi utama"
          >
            {tabs.slice(0, 3).map((tab) => {
              const active = tab.cocok(pathname);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-2.5 text-[13.5px] font-semibold transition-colors lg:px-4 ${
                    active
                      ? "bg-white text-brand shadow-[0_1px_2px_rgba(16,43,80,0.08)] ring-1 ring-line"
                      : "text-navy/70 hover:bg-white/70 hover:text-navy"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-0.5">
            <PreferencesControls />
            <Link
              href="/keranjang"
              className="icon-btn relative hidden md:inline-flex"
              aria-label={`Keranjang, ${count} produk`}
            >
              <ShoppingBag size={20} strokeWidth={2.1} />
              {count > 0 && (
                <span
                  key={count}
                  className="stat-num absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white [animation:cart-pop_.32s_ease]"
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav aria-label="Navigasi utama" className="pb-2 md:hidden">
          <div className="relative grid grid-cols-4 rounded-2xl border border-line/70 bg-white/65 p-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-8px)/4)] transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: `translateX(${Math.max(aktifIndex, 0) * 100}%)`,
                opacity: aktifIndex < 0 ? 0 : 1,
              }}
            >
              <span className="block h-full rounded-xl bg-mist ring-1 ring-line" />
            </span>

            {tabs.map((tab) => {
              const active = tab.cocok(pathname);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={tab.aria}
                  className={`relative flex min-h-11 items-center justify-center rounded-xl px-1 text-[12.5px] font-bold transition-colors duration-200 motion-reduce:transition-none ${
                    active ? "text-brand" : "text-navy/70"
                  }`}
                >
                  {tab.label}
                  {tab.href === "/keranjang" && count > 0 && (
                    <span className="stat-num absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    </div>
  );
}

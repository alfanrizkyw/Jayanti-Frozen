"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "./cart-provider";
import { PreferencesControls } from "./preferences-controls";
import { rupiah } from "@/lib/format";
import type { Settings } from "@/lib/types";

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

export function SiteHeader({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  const { count } = useCart();
  const aktifIndex = tabs.findIndex((tab) => tab.cocok(pathname));

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-navy text-white">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-[10.5px] font-medium tracking-wide sm:text-[11.5px]">
          <span className="flex min-w-0 items-center gap-1.5 truncate text-white/85">
            <span
              className={`h-1.5 w-1.5 flex-none rounded-full ${
                settings.tokoBuka ? "bg-leaf-soft" : "bg-[#F5C86B]"
              }`}
            />
            <span className="truncate">
              {settings.tokoBuka ? "Buka" : "Tutup sementara"}
              <span className="hidden sm:inline">
                {settings.tokoBuka ? " setiap hari" : " · buka lagi"}
              </span>{" "}
              {settings.jamBuka}
            </span>
          </span>
          <span className="whitespace-nowrap text-right text-white/85">
            Gratis ongkir<span className="hidden sm:inline"> min.</span>{" "}
            {rupiah(settings.gratisOngkirMin)}
          </span>
        </div>
      </div>

      <header className="border-b border-line bg-white/95 backdrop-blur">
        <div className="container-page">
          <div className="flex h-16 items-center gap-2 md:h-[72px] md:gap-4">
            <Link
              href="/"
              aria-label="Yanti Frozen, ke beranda"
              className="flex-none rounded-lg py-1"
            >
              <Logo />
            </Link>

            <nav
              className="hidden items-center gap-0.5 md:ml-2 md:flex lg:ml-5 lg:gap-1"
              aria-label="Navigasi utama"
            >
              {tabs.slice(0, 3).map((tab) => {
                const active = tab.cocok(pathname);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors lg:px-4 ${
                      active
                        ? "bg-mist text-brand"
                        : "text-navy/75 hover:bg-mist/70 hover:text-navy"
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

          <nav
            aria-label="Navigasi utama"
            className="-mx-1 pb-1.5 md:hidden"
          >
            <div className="relative grid grid-cols-4">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/4 px-1 transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{
                  transform: `translateX(${Math.max(aktifIndex, 0) * 100}%)`,
                  opacity: aktifIndex < 0 ? 0 : 1,
                }}
              >
                <span className="block h-full rounded-xl bg-mist" />
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
        </div>
      </header>
    </div>
  );
}

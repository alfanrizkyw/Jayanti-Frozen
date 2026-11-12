"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "./cart-provider";
import { PreferencesControls } from "./preferences-controls";
import { rupiah } from "@/lib/format";
import type { Settings } from "@/lib/types";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/lacak", label: "Lacak pesanan" },
];

export function SiteHeader({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  const { count } = useCart();

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
        <div className="container-page flex h-16 items-center gap-2 md:h-[72px] md:gap-4">
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
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors lg:px-4 ${
                    active
                      ? "bg-mist text-brand"
                      : "text-navy/75 hover:bg-mist/70 hover:text-navy"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden flex-none items-center gap-0.5 md:flex">
            <PreferencesControls />
            <Link
              href="/keranjang"
              className="icon-btn relative"
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
      </header>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-navy text-white">
        <div className="container-page grid h-9 grid-cols-2 items-center gap-3 text-[10.5px] font-medium tracking-wide sm:text-[11.5px] md:grid-cols-3">
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
          <span className="hidden items-center justify-self-center gap-1.5 text-white/85 md:flex">
            <MapPin size={12} strokeWidth={2.2} />
            {settings.alamat}
          </span>
          <span className="justify-self-end whitespace-nowrap text-right text-white/85">
            Gratis ongkir<span className="hidden sm:inline"> min.</span>{" "}
            {rupiah(settings.gratisOngkirMin)}
          </span>
        </div>
      </div>

      <header className="border-b border-line bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center gap-2 md:h-[72px] md:gap-4">
          <Link
            href="/"
            aria-label="Jayanti Frozen, ke beranda"
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

          <div className="ml-auto flex flex-none items-center gap-0.5">
            <div className="hidden md:block">
              <PreferencesControls />
            </div>
            <Link href="/katalog" className="icon-btn" aria-label="Cari produk">
              <Search size={20} strokeWidth={2.1} />
            </Link>
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

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="icon-btn md:hidden"
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-line bg-white md:hidden">
            <nav className="container-page flex flex-col py-2" aria-label="Navigasi seluler">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between border-b border-line/70 text-[15px] font-semibold text-navy last:border-0"
                >
                  {link.label}
                  <span aria-hidden="true" className="text-muted">→</span>
                </Link>
              ))}
              <PreferencesControls layout="full" />
              <div className="mt-2 flex items-center gap-3 border-t border-line/70 pt-4 text-[11.5px] font-semibold text-muted">
                <span>Halaman staff:</span>
                <Link href="/admin/masuk" onClick={() => setOpen(false)} className="text-brand">
                  Admin
                </Link>
                <Link href="/kurir/masuk" onClick={() => setOpen(false)} className="text-brand">
                  Kurir
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

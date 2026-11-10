"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, PackageSearch, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

const tabs = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/katalog", label: "Katalog", icon: LayoutGrid },
  { href: "/lacak", label: "Lacak", icon: PackageSearch },
  { href: "/keranjang", label: "Keranjang", icon: ShoppingBag },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav
      aria-label="Navigasi cepat"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                active ? "text-brand" : "text-muted"
              }`}
            >
              <span className="relative">
                <Icon size={21} strokeWidth={active ? 2.3 : 1.9} />
                {tab.href === "/keranjang" && count > 0 && (
                  <span className="stat-num absolute -right-2.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </span>
              {tab.label}
              {active && (
                <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-brand" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

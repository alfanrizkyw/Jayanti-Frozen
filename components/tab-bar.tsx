"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { NAV_TABS } from "@/lib/nav";
import { useCart } from "./cart-provider";

export function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();
  const aktifIndex = NAV_TABS.findIndex((tab) => tab.cocok(pathname));

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="relative grid grid-cols-5 px-2 pb-1.5 pt-2">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-2 w-[calc((100%-16px)/5)] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateX(${Math.max(aktifIndex, 0) * 100}%)`,
            opacity:
              aktifIndex < 0 || NAV_TABS[aktifIndex].utama ? 0 : 1,
          }}
        >
          <span className="tab-pill block h-full rounded-xl bg-mist ring-1 ring-line" />
        </span>

        {NAV_TABS.map((tab) => {
          const aktif = tab.cocok(pathname);
          const Ikon = tab.Ikon;

          if (tab.utama) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={aktif ? "page" : undefined}
                aria-label={`Keranjang, ${count} produk`}
                className="press relative flex min-h-[54px] flex-col items-center justify-end rounded-xl pb-1.5"
              >
                <span
                  data-keranjang-target
                  className={`absolute left-1/2 top-0 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-[24px] items-center justify-center rounded-full bg-[linear-gradient(160deg,#3f95dc,#1f66a8)] text-white shadow-[0_10px_20px_-8px_rgba(16,43,80,0.6)] ring-[5px] ring-paper transition-transform duration-200 ease-out motion-reduce:transition-none ${
                    aktif ? "scale-105" : ""
                  }`}
                >
                  <ShoppingBag size={22} strokeWidth={2.2} />
                  {count > 0 && (
                    <span
                      key={count}
                      className="stat-num absolute -right-1.5 -top-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-navy px-1 text-[9.5px] font-bold text-white ring-2 ring-paper [animation:cart-pop_.32s_ease]"
                    >
                      {count}
                    </span>
                  )}
                </span>
                <span
                  className={`whitespace-nowrap text-[10px] font-bold leading-none min-[360px]:text-[10.5px] ${
                    aktif ? "text-brand" : "text-navy/70"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={aktif ? "page" : undefined}
              aria-label={tab.aria}
              className={`press flex min-h-[54px] flex-col items-center justify-end gap-1 rounded-xl px-0.5 pb-1.5 pt-1 text-[10px] font-bold leading-none transition-colors duration-200 motion-reduce:transition-none min-[360px]:text-[10.5px] ${
                aktif ? "text-brand" : "text-navy/70"
              }`}
            >
              <Ikon size={20} strokeWidth={2.1} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

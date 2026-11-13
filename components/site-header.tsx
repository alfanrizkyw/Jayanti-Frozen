"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_TABS } from "@/lib/nav";
import { Logo } from "./logo";
import { useCart } from "./cart-provider";
import { PreferencesControls } from "./preferences-controls";

const AMBANG_ATAS = 96;
const AMBANG_GESER = 4;

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [sembunyi, setSembunyi] = useState(false);
  const [bergulir, setBergulir] = useState(false);
  const [hash, setHash] = useState("");
  const posisiTerakhir = useRef(0);

  useEffect(() => {
    setSembunyi(false);
    setBergulir(false);
    posisiTerakhir.current = window.scrollY;
  }, [pathname]);

  useEffect(() => {
    const baca = () => setHash(window.location.hash);
    baca();
    window.addEventListener("hashchange", baca);
    window.addEventListener("popstate", baca);
    return () => {
      window.removeEventListener("hashchange", baca);
      window.removeEventListener("popstate", baca);
    };
  }, [pathname]);

  const klikTab = (href: string) => {
    const [jalur, bagian] = href.split("#");
    if (jalur === pathname) setHash(bagian ? `#${bagian}` : "");
  };

  useEffect(() => {
    let frame = 0;
    posisiTerakhir.current = window.scrollY;

    const periksa = () => {
      frame = 0;
      const y = window.scrollY;
      const geser = y - posisiTerakhir.current;
      setBergulir(y > 8);
      if (y <= AMBANG_ATAS) {
        setSembunyi(false);
      } else if (geser > AMBANG_GESER) {
        setSembunyi(true);
      } else if (geser < -AMBANG_GESER) {
        setSembunyi(false);
      }
      posisiTerakhir.current = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(periksa);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      onFocusCapture={() => setSembunyi(false)}
      className={`sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none ${
        sembunyi ? "-translate-y-full" : "translate-y-0"
      } ${bergulir && !sembunyi ? "shadow-[0_10px_24px_rgba(16,43,80,0.08)]" : ""}`}
    >
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
            {NAV_TABS.map((tab) => {
              const active = tab.cocok(pathname, hash);
              const keranjang = tab.href === "/keranjang";
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => klikTab(tab.href)}
                  aria-current={active ? "page" : undefined}
                  aria-label={keranjang ? `Keranjang, ${count} produk` : undefined}
                  className={`press inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[13.5px] font-semibold transition-colors lg:px-4 ${
                    active
                      ? "bg-white text-brand shadow-[0_1px_2px_rgba(16,43,80,0.08)] ring-1 ring-line"
                      : "text-navy/70 hover:bg-white/70 hover:text-navy"
                  }`}
                >
                  {tab.label}
                  {keranjang && count > 0 && (
                    <span
                      key={count}
                      className="stat-num flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white [animation:cart-pop_.32s_ease]"
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-0.5">
            <PreferencesControls />
          </div>
        </div>

      </header>
    </div>
  );
}

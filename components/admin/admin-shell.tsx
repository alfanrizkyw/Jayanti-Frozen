"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Package,
  ReceiptText,
  Settings2,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { PreferencesControls } from "@/components/preferences-controls";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/admin/pesanan", label: "Pesanan", icon: ReceiptText },
  { href: "/admin/produk", label: "Produk & stok", icon: Package },
  { href: "/admin/promo", label: "Promo & banner", icon: Megaphone },
  { href: "/admin/laporan", label: "Laporan penjualan", icon: BarChart3 },
  { href: "/admin/pengaturan", label: "Pengaturan toko", icon: Settings2 },
];

export function AdminShell({
  nama,
  baru,
  children,
}: {
  nama: string;
  baru: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [keluar, setKeluar] = useState(false);

  function aktif(item: (typeof NAV)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  async function logout() {
    setKeluar(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/masuk");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Navigasi admin">
      {NAV.map((item) => {
        const Icon = item.icon;
        const on = aktif(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setBuka(false)}
            aria-current={on ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition-colors ${
              on
                ? "bg-white/12 text-white"
                : "text-white/65 hover:bg-white/6 hover:text-white"
            }`}
          >
            <Icon size={18} className={on ? "text-sky" : "opacity-80"} />
            <span className="flex-1">{item.label}</span>
            {item.href === "/admin/pesanan" && baru > 0 && (
              <span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-extrabold leading-tight text-navy-deep">
                {baru}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-svh bg-paper lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden flex-col bg-navy-deep text-white lg:sticky lg:top-0 lg:flex lg:h-svh">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo tone="light" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sky/80">
            Panel admin
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/6 hover:text-white"
          >
            <ExternalLink size={17} /> Lihat toko
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={keluar}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/6 hover:text-white"
          >
            <LogOut size={17} /> {keluar ? "Keluar…" : "Keluar"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-white/92 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-7">
            <button
              type="button"
              onClick={() => setBuka(true)}
              className="icon-btn lg:hidden"
              aria-label="Buka menu admin"
            >
              <Menu size={21} />
            </button>
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:block">
                <PreferencesControls />
              </div>
              <Link
                href="/admin/pesanan?status=baru"
                className="hidden items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11.5px] font-bold text-navy sm:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sun" />
                {baru} pesanan baru
              </Link>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[12px] font-extrabold text-white">
                {nama
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-[12.5px] font-bold text-navy">{nama}</p>
                <p className="text-[10.5px] text-muted">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-16 pt-5 md:px-7 md:pt-7">{children}</main>

        <footer className="border-t border-line px-5 py-5 text-center text-[11px] text-muted md:px-7">
          Yanti Frozen · Panel admin · Data tersimpan aman
        </footer>
      </div>

      {buka && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-navy-deep/45 backdrop-blur-[2px]"
            onClick={() => setBuka(false)}
          />
          <div className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-navy-deep text-white shadow-2xl fade-in">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <Logo tone="light" />
              <button
                type="button"
                onClick={() => setBuka(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 hover:bg-white/10"
                aria-label="Tutup menu admin"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {nav}
              <PreferencesControls layout="gelap" />
            </div>
            <div className="border-t border-white/10 p-3">
              <Link
                href="/"
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold text-white/60 hover:text-white"
              >
                <ArrowLeft size={17} /> Kembali ke toko
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-semibold text-white/60 hover:text-white"
              >
                <LogOut size={17} /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

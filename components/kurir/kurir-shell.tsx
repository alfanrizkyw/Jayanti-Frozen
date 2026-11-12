"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";

export function KurirShell({
  nama,
  kendaraan,
  children,
}: {
  nama: string;
  kendaraan: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [keluar, setKeluar] = useState(false);

  async function logout() {
    setKeluar(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/kurir/masuk");
    router.refresh();
  }

  return (
    <div className="min-h-svh bg-paper">
      <header className="bg-navy-deep text-white">
        <div className="mx-auto flex h-16 w-full max-w-[880px] items-center gap-3 px-4">
          <Logo tone="light" size={38} />
          <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky sm:inline">
            Halaman kurir
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-[12.5px] font-bold">{nama}</p>
              <p className="text-[10px] text-white/55">{kendaraan}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold">
              {nama
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </span>
            <button
              type="button"
              onClick={logout}
              disabled={keluar}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Keluar dari halaman kurir"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[880px] px-4 pb-16 pt-5">{children}</main>

      <footer className="mx-auto flex w-full max-w-[880px] items-center justify-between gap-3 px-4 pb-8 text-[11px] text-muted">
        <span>Yanti Frozen · Aplikasi kurir</span>
        <Link href="/" className="inline-flex items-center gap-1 font-bold text-brand">
          <ArrowLeft size={12} /> Kembali ke toko
        </Link>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  Check,
  Code2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/logo";

type Peran = "admin" | "kurir" | "developer";

const info: Record<
  Peran,
  {
    judul: string;
    sub: string;
    labelSandi: string;
    ikon: typeof ShieldCheck;
    tombol: string;
    kembali: string;
  }
> = {
  admin: {
    judul: "Masuk admin",
    sub: "Kelola pesanan, pembayaran, produk, promo, dan laporan toko.",
    labelSandi: "Kata sandi admin",
    ikon: ShieldCheck,
    tombol: "Masuk ke panel admin",
    kembali: "/",
  },
  kurir: {
    judul: "Masuk kurir",
    sub: "Cukup masukkan kata sandi tim kurir. Tidak perlu nomor HP.",
    labelSandi: "Kata sandi kurir",
    ikon: Bike,
    tombol: "Masuk ke halaman kurir",
    kembali: "/",
  },
  developer: {
    judul: "Masuk developer",
    sub: "Pantau error, kelola akun staff, dan periksa status sistem.",
    labelSandi: "Kata sandi developer",
    ikon: Code2,
    tombol: "Masuk ke panel developer",
    kembali: "/",
  },
};

export function StaffLogin({ peran }: { peran: Peran }) {
  const router = useRouter();
  const [sandi, setSandi] = useState("");
  const [proses, setProses] = useState(false);
  const [error, setError] = useState("");
  const meta = info[peran];
  const Icon = meta.ikon;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setProses(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: peran, sandi }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Gagal masuk. Periksa kembali data Anda.");
        setProses(false);
        return;
      }
      router.push(json.tujuan || meta.kembali);
      router.refresh();
    } catch {
      setError("Jaringan bermasalah. Periksa koneksi lalu coba lagi.");
      setProses(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1080px] items-center justify-between px-4 md:px-6">
          <Link href="/" aria-label="Jayanti Frozen, ke beranda">
            <Logo />
          </Link>
          <Link
            href={meta.kembali}
            className="inline-flex min-h-11 items-center gap-1.5 text-[12.5px] font-bold text-muted hover:text-navy"
          >
            <ArrowLeft size={14} /> Kembali ke toko
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-8 md:py-14">
        <div className="w-full max-w-[430px]">
          <div className="card overflow-hidden">
            <div className="bg-navy px-6 py-6 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sky">
                <Icon size={22} />
              </span>
              <h1 className="mt-3 text-[23px] font-extrabold">{meta.judul}</h1>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/70">
                {meta.sub}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4 p-5 md:p-6">
              <div>
                <label htmlFor="sandi" className="label">
                  {meta.labelSandi}
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="sandi"
                    type="password"
                    className="field pl-10"
                    value={sandi}
                    onChange={(e) => setSandi(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3.5 py-2.5 text-[12px] text-[#8F2E25]"
                >
                  <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={proses}
                className="btn btn-primary w-full"
                aria-busy={proses}
              >
                {proses ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Memeriksa…
                  </>
                ) : (
                  <>
                    {meta.tombol} <Check size={15} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-muted">
                Halaman ini khusus staff Jayanti Frozen. Pembeli tidak perlu
                membuat akun.
              </p>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11.5px] font-semibold text-muted">
            <Link href="/admin/masuk" className="hover:text-navy">
              Admin
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/kurir/masuk" className="hover:text-navy">
              Kurir
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/developer/masuk" className="hover:text-navy">
              Developer
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

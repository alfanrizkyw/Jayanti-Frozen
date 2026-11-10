"use client";

import { RotateCw, Snowflake } from "lucide-react";
import { Logo } from "@/components/logo";

export default function ErrorToko({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-[430px] rounded-[22px] border border-line bg-white p-7 text-center shadow-card">
        <Logo />
        <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-brand">
          <Snowflake size={26} />
        </span>
        <h1 className="mt-4 text-[22px] font-extrabold text-navy">
          Halaman gagal dimuat
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Koneksi ke data toko sedang terganggu. Data Anda tidak hilang. Coba
          muat ulang sebentar lagi.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary flex-1">
            <RotateCw size={15} /> Coba lagi
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-outline flex-1"
          >
            Muat ulang
          </button>
        </div>
        {error.digest && (
          <p className="mt-4 text-[10.5px] text-muted">Kode: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

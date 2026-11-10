"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Store } from "lucide-react";

export function StoreToggle({
  buka,
  jamBuka,
  tutupCatatan,
}: {
  buka: boolean;
  jamBuka: string;
  tutupCatatan: string;
}) {
  const router = useRouter();
  const [proses, setProses] = useState(false);
  const [error, setError] = useState("");

  async function ubah() {
    setProses(true);
    setError("");
    try {
      const res = await fetch("/api/admin/toko", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buka: !buka }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal mengubah status toko.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah status toko.");
    } finally {
      setProses(false);
    }
  }

  return (
    <section
      className={`card flex flex-wrap items-center gap-3 p-4 ${
        buka ? "border-leaf/30" : "border-[#F0D9A8] bg-[#FEF8E9]"
      }`}
    >
      <span
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
          buka ? "bg-leaf-soft text-leaf" : "bg-[#F7E7C3] text-[#8A520B]"
        }`}
      >
        <Store size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-extrabold text-navy">
          Toko {buka ? "sedang buka" : "sedang tutup"}
        </p>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
          {buka
            ? `Pesanan online aktif · jam buka ${jamBuka || "belum diisi"}`
            : tutupCatatan}
        </p>
        {error && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-[#8F2E25]">
            <AlertCircle size={12} /> {error}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={ubah}
        disabled={proses}
        className={`btn w-full sm:w-auto ${buka ? "btn-outline" : "btn-primary"}`}
      >
        {proses ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Store size={15} />
        )}
        {buka ? "Tutup toko sekarang" : "Buka toko sekarang"}
      </button>
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function QuickPaid({ kode }: { kode: string }) {
  const router = useRouter();
  const [proses, setProses] = useState(false);
  const [error, setError] = useState("");

  async function tandai() {
    setProses(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(kode)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dibayar: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memverifikasi.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memverifikasi.");
      setProses(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={tandai}
        disabled={proses}
        className="btn btn-sm btn-primary"
      >
        {proses ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check size={14} />
        )}
        Tandai lunas
      </button>
      {error && <span className="text-[10px] text-[#8F2E25]">{error}</span>}
    </div>
  );
}

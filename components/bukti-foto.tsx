"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

/** Tampil hanya bila file bukti benar-benar ada di penyimpanan. */
export function BuktiFoto({
  orderId,
  judul = "Foto bukti penerimaan",
}: {
  orderId: string;
  judul?: string;
}) {
  const [gagal, setGagal] = useState(false);
  if (gagal) return null;
  const src = `/api/bukti/${encodeURIComponent(orderId)}`;

  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
        <Camera size={12} /> {judul}
      </p>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block overflow-hidden rounded-lg border border-line bg-paper"
        aria-label={`Buka ${judul}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={judul}
          loading="lazy"
          decoding="async"
          onError={() => setGagal(true)}
          className="h-auto max-h-[260px] w-full object-cover"
        />
      </a>
      <p className="mt-1.5 text-[10.5px] text-muted">
        Ketuk foto untuk melihat ukuran penuh.
      </p>
    </div>
  );
}

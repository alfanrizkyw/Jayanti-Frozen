"use client";

import { Megaphone, X } from "lucide-react";
import { useEffect, useState } from "react";

export function DismissibleNotice({
  id,
  judul,
  teks,
}: {
  id: string;
  judul: string;
  teks: string;
}) {
  const [tampil, setTampil] = useState(false);
  const key = `jf_notice_${id}`;

  useEffect(() => {
    setTampil(localStorage.getItem(key) !== "tutup");
  }, [key]);

  if (!tampil) return null;

  return (
    <div className="container-page pt-4">
      <div className="rise flex items-start gap-3 rounded-xl border border-[#C9E1F7] bg-mist px-3.5 py-3">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white text-brand">
          <Megaphone size={16} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-navy">{judul}</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy/75">{teks}</p>
        </div>
        <button
          type="button"
          aria-label="Tutup pengumuman"
          onClick={() => {
            localStorage.setItem(key, "tutup");
            setTampil(false);
          }}
          className="-mr-1 -mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg text-navy/60 hover:bg-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

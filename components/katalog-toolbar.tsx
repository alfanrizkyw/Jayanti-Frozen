"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function KatalogToolbar({
  urut,
  stok,
  total,
}: {
  urut: string;
  stok: boolean;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12.5px] font-medium text-muted" aria-live="polite">
        <span className="stat-num font-bold text-navy">{total}</span> produk ditemukan
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-navy">
          <input
            type="checkbox"
            checked={stok}
            onChange={(e) => update("stok", e.target.checked ? "1" : null)}
            className="h-4 w-4 rounded border-line accent-[#2166AC]"
          />
          Hanya yang tersedia
        </label>
        <label className="flex items-center gap-2 text-[12.5px] font-semibold text-navy">
          <span className="sr-only">Urutkan produk</span>
          <select
            className="field h-10 min-h-0 w-auto min-w-[150px] py-0 pl-3 text-[12.5px] font-semibold"
            value={urut}
            onChange={(e) => update("urut", e.target.value)}
          >
            <option value="unggulan">Rekomendasi</option>
            <option value="harga-rendah">Harga terendah</option>
            <option value="harga-tinggi">Harga tertinggi</option>
            <option value="nama">Nama A–Z</option>
          </select>
        </label>
      </div>
    </div>
  );
}

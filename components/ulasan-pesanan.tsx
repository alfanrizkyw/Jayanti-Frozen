"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";

/**
 * Ulasan tampil di akhir halaman pesanan setelah status selesai. Satu pesanan
 * hanya bisa diberi satu ulasan, dan hasilnya masuk ke laporan admin.
 */
export function UlasanPesanan({
  kode,
  bintang,
  ulasan,
}: {
  kode: string;
  bintang?: number | null;
  ulasan?: string;
}) {
  const [nilai, setNilai] = useState(bintang ?? 0);
  const [teks, setTeks] = useState(ulasan ?? "");
  const [terkirim, setTerkirim] = useState(bintang != null);
  const [kirim, setKirim] = useState(false);
  const [pesan, setPesan] = useState("");

  async function simpan() {
    if (!nilai) {
      setPesan("Pilih bintang dulu ya.");
      return;
    }
    setKirim(true);
    setPesan("");
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(kode)}/ulasan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bintang: nilai, ulasan: teks }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Ulasan gagal disimpan.");
      setTerkirim(true);
    } catch (err) {
      setPesan(err instanceof Error ? err.message : "Ulasan gagal disimpan.");
    } finally {
      setKirim(false);
    }
  }

  return (
    <section className="mt-4 rounded-[18px] border border-line bg-white p-4 md:p-5">
      <h2 className="text-[14px] font-extrabold text-navy">
        {terkirim ? "Terima kasih atas ulasan Anda" : "Nilai pesanan ini"}
      </h2>
      <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
        {terkirim
          ? "Bintang dan ulasan Anda sudah masuk ke laporan admin toko."
          : "Bintang dan ulasan membantu toko memperbaiki layanan."}
      </p>

      <div className="mt-3 flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const nyala = n <= nilai;
          if (terkirim) {
            return (
              <Star
                key={n}
                size={22}
                aria-hidden="true"
                className={nyala ? "text-[#F2A03A]" : "text-line"}
                fill={nyala ? "currentColor" : "none"}
              />
            );
          }
          return (
            <button
              key={n}
              type="button"
              aria-label={`Beri ${n} bintang`}
              aria-pressed={nyala}
              onClick={() => {
                setNilai(n);
                setPesan("");
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#F2A03A] transition-colors hover:bg-[#FFF4E3]"
            >
              <Star
                size={26}
                aria-hidden="true"
                className={nyala ? "text-[#F2A03A]" : "text-line"}
                fill={nyala ? "currentColor" : "none"}
              />
            </button>
          );
        })}
        <span className="ml-1 text-[12px] font-bold text-navy">
          {nilai ? `${nilai} dari 5` : "Belum dinilai"}
        </span>
      </div>

      {terkirim ? (
        teks.trim() ? (
          <p className="mt-3 rounded-xl bg-paper px-3.5 py-3 text-[12px] leading-relaxed text-navy/80">
            {teks.trim()}
          </p>
        ) : (
          <p className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-leaf">
            <CheckCircle2 size={14} /> Ulasan sudah tersimpan.
          </p>
        )
      ) : (
        <>
          <div className="mt-3">
            <label htmlFor="ulasan" className="label">
              Ulasan (opsional)
            </label>
            <textarea
              id="ulasan"
              className="field"
              rows={3}
              maxLength={400}
              value={teks}
              onChange={(e) => setTeks(e.target.value)}
              placeholder="Contoh: barang masih beku, kurir cepat dan ramah."
            />
          </div>
          {pesan && (
            <p role="alert" className="mt-2 text-[11.5px] font-semibold text-[#8F2E25]">
              {pesan}
            </p>
          )}
          <button
            type="button"
            onClick={simpan}
            disabled={kirim || !nilai}
            className="btn btn-primary mt-3 w-full"
          >
            {kirim ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Star size={16} />
            )}
            {kirim ? "Mengirim…" : "Kirim ulasan"}
          </button>
        </>
      )}
    </section>
  );
}
